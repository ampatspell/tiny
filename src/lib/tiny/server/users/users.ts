import { run } from '../../utils/utils.ts';
import type { Database } from '../database/database.ts';
import type { DB } from '../database/schema.js';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { uid } from '../utils.ts';
import { omit } from '../../utils/object.ts';
import jwt from 'jsonwebtoken';
import { error } from '@sveltejs/kit';

const { JsonWebTokenError } = jwt;

export type TokenPayload = {
  id: string;
  email: string;
  role: Tiny.Role;
};

export type CreateUsersOptions = {
  db: Database<DB>;
  secret?: string;
  roles?: {
    admin: Tiny.Role;
    default: Tiny.Role;
  };
};

export const createUsers = async (opts: CreateUsersOptions) => {
  const { db, secret, roles } = opts;

  const crypto = run(() => {
    const sync = (opts: { password: string; salt: string }) => {
      return pbkdf2Sync(opts.password, opts.salt, 1000, 32, `sha512`).toString(`hex`);
    };
    const create = ({ password }: { password: string }) => {
      const salt = randomBytes(16).toString('hex');
      const hash = sync({ password, salt });
      return { salt, hash };
    };
    const verify = ({ password, salt, hash }: { hash: string; salt: string; password: string }) => {
      const existing = sync({ password, salt });
      return existing === hash;
    };
    return {
      sync,
      create,
      verify,
    };
  });

  const create = async ({ email, password, role }: { email: string; password: string; role?: Tiny.Role }) => {
    const { salt, hash } = crypto.create({ password });
    if (!role) {
      const { count } = await db.selectFrom('users').select(db.fn.countAll().as('count')).executeTakeFirstOrThrow();
      if (!roles) {
        error(500, 'Roles are missing');
      }
      role = count === 0 ? roles.admin : roles.default;
    }
    const result = await db
      .insertInto('users')
      .returningAll()
      .values({ id: uid(), email, role, hash, salt })
      .executeTakeFirstOrThrow();

    return omit(result, ['hash', 'salt']);
  };

  const verify = async ({ email, password }: { email: string; password: string }) => {
    const record = await db.selectFrom('users').where('email', '==', email).selectAll().executeTakeFirst();
    if (record) {
      const { id, role, salt, hash } = record;
      if (hash && salt && crypto.verify({ hash, salt, password })) {
        return {
          id,
          email,
          role,
        } as {
          id: string;
          email: string;
          role: Tiny.Role;
        };
      }
    }
  };

  const _verify = verify;

  const token = run(() => {
    const create = async ({ email, password }: { email: string; password: string }) => {
      const data = await _verify({ email, password });
      if (data) {
        return await new Promise<string>((resolve, reject) => {
          if (!secret) {
            return reject(new Error('Secret missing'));
          }
          jwt.sign(data satisfies TokenPayload, secret, { expiresIn: '7d' }, (err, token) => {
            if (err) {
              return reject(err);
            }
            return resolve(token!);
          });
        });
      }
    };

    const verify = async (token: string) => {
      return new Promise<TokenPayload | undefined>((resolve, reject) => {
        if (!secret) {
          return reject(new Error('Secret missing'));
        }
        jwt.verify(token, secret, (err, payload) => {
          if (err instanceof JsonWebTokenError) {
            return resolve(undefined);
          } else if (err) {
            return reject(err);
          }
          resolve(payload as TokenPayload);
        });
      });
    };

    return {
      create,
      verify,
    };
  });

  return {
    create,
    verify,
    token,
  };
};

export type Users = Awaited<ReturnType<typeof createUsers>>;
