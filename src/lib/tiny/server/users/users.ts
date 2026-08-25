import { run } from '../../utils/utils.ts';
import type { Database } from '../database/database.ts';
import type { DB } from '../database/schema.js';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { uid } from '../utils.ts';
import { omit } from '../../utils/object.ts';
import jwt from 'jsonwebtoken';

export type TokenPayload = {
  id: string;
  email: string;
  type: string;
};

export type CreateUsersOptions = {
  db: Database<DB>;
  secret?: string;
};

export const createUsers = async (opts: CreateUsersOptions) => {
  const { db, secret } = opts;

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

  const create = async ({ email, password, type }: { email: string; password: string; type: string }) => {
    const { salt, hash } = crypto.create({ password });

    const result = await db
      .insertInto('users')
      .returningAll()
      .values({ id: uid(), email, type, hash, salt })
      .executeTakeFirstOrThrow();

    return omit(result, ['hash', 'salt']);
  };

  const verify = async ({ email, password }: { email: string; password: string }) => {
    const record = await db.selectFrom('users').where('email', '==', email).selectAll().executeTakeFirst();
    if (record) {
      const { id, type, salt, hash } = record;
      if (hash && salt && crypto.verify({ hash, salt, password })) {
        return { id, email, type };
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
      return new Promise<TokenPayload>((resolve, reject) => {
        if (!secret) {
          return reject(new Error('Secret missing'));
        }
        jwt.verify(token, secret, (err, payload) => {
          if (err) {
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
