import { describe, expect, it } from 'vitest';
import { withServices } from './helpers/utils.ts';
import type { Any } from '../lib/tiny/utils/utils.ts';

describe('users', () => {
  it('creates user', async () => {
    await withServices(async (services) => {
      const result = await services.users.create({
        email: 'zeeba@gmail.com',
        password: 'huluu',
        role: 'admin',
      });

      expect(result!.id).toBeTruthy();
      expect(result).toStrictEqual({ id: result!.id, email: 'zeeba@gmail.com', role: 'admin' });
    });
  });

  it('verifies created user', async () => {
    await withServices(async (services) => {
      await services.users.create({
        email: 'zeeba@gmail.com',
        password: 'huluu',
        role: 'admin',
      });

      {
        const rec = await services.users.verify({ email: 'zeeba@gmail.com', password: 'huluu' });
        expect(rec).toBeTruthy();
        expect(rec).toStrictEqual({ id: rec!.id, email: 'zeeba@gmail.com', role: 'admin' });
      }
      {
        const rec = await services.users.verify({ email: 'zeeba@gmail.com', password: 'hulu' });
        expect(rec).toBeFalsy();
      }
      {
        const rec = await services.users.verify({ email: 'zeeba@gmail.co.uk', password: 'huluu' });
        expect(rec).toBeFalsy();
      }
    });
  });

  it('creates jwt token', async () => {
    await withServices(async (services) => {
      await services.users.create({
        email: 'zeeba@gmail.com',
        password: 'huluu',
        role: 'admin',
      });

      const token = await services.users.token.create({
        email: 'zeeba@gmail.com',
        password: 'huluu',
      });
      expect(token).toBeTruthy();

      const data: Any = await services.users.token.verify(token!);
      expect(data).toStrictEqual({
        status: 'success',
        token: {
          email: 'zeeba@gmail.com',
          exp: data.token.exp,
          iat: data.token.iat,
          id: data.token.id,
          role: 'admin',
        },
      });
    });
  });
});
