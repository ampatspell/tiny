import { describe, expect, it } from 'vitest';
import { withServices, withTemporaryFolder } from './helpers/utils.ts';
import { jpeg } from '#lib/tiny/server/files/thumbnails.js';
import { createServices, type CreateServicesOptions } from '#lib/tiny/server/services/services.js';
import type { DB } from '#lib/tiny/server/database/schema.js';

describe('services', () => {
  it('creates services', async () => {
    await withTemporaryFolder(async (dir) => {
      const opts: CreateServicesOptions = {
        dir,
        database: {
          wal: false,
        },
        files: {
          thumbnails: {
            '100x100': jpeg({ size: 100 }),
            '1024x1024': jpeg({ size: 1024 }),
            '2048x2048': jpeg({ size: 2048 }),
          },
        },
        users: {},
      };

      const services = await createServices(opts);
      expect(!!services).toStrictEqual(true);

      await services.destroy();
    });
  });

  it('reuses existing services', async () => {
    await withTemporaryFolder(async (dir) => {
      const opts: CreateServicesOptions = {
        dir,
        database: {
          wal: false,
        },
        files: {
          thumbnails: {
            '100x100': jpeg({ size: 100 }),
            '1024x1024': jpeg({ size: 1024 }),
            '2048x2048': jpeg({ size: 2048 }),
          },
        },
        users: {},
      };

      const a = await createServices(opts);
      const b = await createServices(opts);

      expect(a.database === b.database).toBeTruthy();

      await a.destroy();

      const c = await createServices(opts);
      expect(b.database === c.database).toBeFalsy();

      await c.destroy();
    });
  });

  it('works as a helper with migrations applied', async () => {
    await withServices<DB>(async (services) => {
      const db = services.database.db;
      await db
        .insertInto('index')
        .values({
          id: 'one',
          title: 'maybe',
          backgroundColor: '#000',
          backgroundOffset: 0,
          description: '',
          indexBackgroundColor: '#000',
          indexTextColor: '#fff',
          textColor: '#fff',
        })
        .execute();

      const res = await db.selectFrom('index').selectAll().executeTakeFirstOrThrow();
      expect(res.title).toStrictEqual('maybe');
    });
  });
});
