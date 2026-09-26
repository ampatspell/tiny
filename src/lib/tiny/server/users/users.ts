import { error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { pbkdf2, randomBytes } from 'node:crypto';
import { hasValues, omit } from '../../utils/object.ts';
import type { Database } from '../database/database.ts';
import type { DB } from '../database/schema.js';
import { uid } from '../utils.ts';

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

class UsersCryptoService {
  async sync(opts: { password: string; salt: string }) {
    return new Promise<string>((resolve, reject) => {
      pbkdf2(opts.password, opts.salt, 300000, 32, `sha512`, (err, buff) => {
        if (err) {
          return reject(err);
        }
        return resolve(buff.toString(`hex`));
      });
    });
  }

  async create({ password }: { password: string }) {
    const salt = randomBytes(16).toString('hex');
    const hash = await this.sync({ password, salt });
    return { salt, hash };
  }

  async verify({ password, salt, hash }: { hash: string; salt: string; password: string }) {
    const existing = await this.sync({ password, salt });
    return existing === hash;
  }
}

type VerifyTokenResponse =
  | {
      status: 'success';
      token: TokenPayload;
    }
  | {
      status: 'error';
      reason: string;
    };

type VerifyUserAndRoleResponse =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      reason: string;
    };

class UsersTokenService {
  private readonly users: UsersService;

  private get db() {
    return this.users['db'];
  }

  private get secret() {
    return this.users['secret'];
  }

  constructor(users: UsersService) {
    this.users = users;
  }

  private async sign(data: TokenPayload) {
    const { secret } = this;
    return await new Promise<string>((resolve, reject) => {
      if (!secret) {
        return reject(new Error('Secret missing'));
      }
      jwt.sign(data, secret, { expiresIn: '1y' }, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token!);
      });
    });
  }

  async create({ email, password }: { email: string; password: string }) {
    const data = await this.users.verify({ email, password });
    if (data) {
      return this.sign(data);
    }
  }

  private async verifyToken(token: string) {
    const { secret } = this;
    return new Promise<VerifyTokenResponse>((resolve, reject) => {
      if (!secret) {
        return reject(new Error('Secret missing'));
      }
      jwt.verify(token, secret, (error, payload) => {
        if (error instanceof JsonWebTokenError) {
          return resolve({
            status: 'error',
            reason: error.message,
          });
        } else if (error) {
          return reject(error);
        }
        resolve({
          status: 'success',
          token: payload as TokenPayload,
        });
      });
    });
  }

  private async verifyUser(token: TokenPayload) {
    const record = await this.db
      .selectFrom('users')
      .select('role')
      .where('email', '==', token.email)
      .executeTakeFirst();

    if (record) {
      if (record.role === token.role) {
        return {
          status: 'success' as const,
        };
      } else {
        return {
          status: 'error' as const,
          reason: 'role',
        };
      }
    } else {
      return {
        status: 'error' as const,
        reason: 'user',
      };
    }
  }

  async verify(payload: string) {
    const tokenRes = await this.verifyToken(payload);
    if (tokenRes.status === 'success') {
      const token = tokenRes.token;
      const userRes = await this.verifyUser(token);
      if (userRes.status === 'success') {
        return {
          status: 'success' as const,
          token,
        };
      } else {
        return userRes;
      }
    } else {
      return tokenRes;
    }
  }
}

export class UsersService {
  private readonly opts: CreateUsersOptions;
  private readonly crypto: UsersCryptoService;
  readonly token: UsersTokenService;

  private get db() {
    return this.opts.db;
  }

  private get secret() {
    return this.opts.secret;
  }

  private get roles() {
    return this.opts.roles;
  }

  constructor(opts: CreateUsersOptions) {
    this.opts = opts;
    this.crypto = new UsersCryptoService();
    this.token = new UsersTokenService(this);
  }

  private normalizeEmail(email: string) {
    return email.toLowerCase().trim();
  }

  async create({ email, password, role }: { email: string; password: string; role?: Tiny.Role }) {
    const { crypto, db, roles } = this;
    email = this.normalizeEmail(email);

    const { salt, hash } = await crypto.create({ password });

    if (!role) {
      const { count } = await db.selectFrom('users').select(db.fn.countAll().as('count')).executeTakeFirstOrThrow();
      if (!roles) {
        error(500, 'Roles are missing');
      }
      role = count === 0 ? roles.admin : roles.default;
    }

    if (await db.selectFrom('users').select('id').where('email', '==', email).executeTakeFirst()) {
      return;
    }

    const result = await db
      .insertInto('users')
      .returningAll()
      .values({ id: uid(), email, role, hash, salt })
      .executeTakeFirstOrThrow();

    return omit(result, ['hash', 'salt']);
  }

  async verify({ email, password }: { email: string; password: string }) {
    const { db, crypto } = this;
    email = this.normalizeEmail(email);

    const record = await db.selectFrom('users').where('email', '==', email).selectAll().executeTakeFirst();
    if (record) {
      const { id, role, salt, hash } = record;
      if (hash && salt && (await crypto.verify({ hash, salt, password }))) {
        return {
          id,
          email,
          role: role as Tiny.Role,
        };
      }
    }
  }

  async update({ id, email, role, password }: { id: string; email?: string; role?: string; password?: string }) {
    const { db, crypto } = this;
    if (email) {
      email = this.normalizeEmail(email);
    }

    let data: Partial<{
      email: string;
      role: string;
      salt: string;
      hash: string;
    }> = {
      email,
      role,
    };

    if (password) {
      const hs = await crypto.create({ password });
      data = { ...data, ...hs };
    }

    if (hasValues(data)) {
      await db.updateTable('users').set(data).where('id', '==', id).executeTakeFirstOrThrow();
    }
  }
}

export const createUsers = async (opts: CreateUsersOptions) => new UsersService(opts);

export type Users = Awaited<ReturnType<typeof createUsers>>;
