import { describe, expect, it } from 'vitest';
import { withServices, withTemporaryFolder } from './helpers/utils.ts';
import { join } from 'node:path';
import type { DB } from '$lib/server/database/schema.js';
import { jpeg } from '$lib/tiny/server/files/thumbnails.js';
import { createServices } from '$lib/tiny/server/services/services.js';

describe('services', () => {
  it('creates services', async () => {
    await withTemporaryFolder(async (dir) => {
      const opts = {
        dir,
        database: {
          migrations: join(dir, 'migrations'),
          wal: false,
        },
        files: {
          thumbnails: [jpeg({ size: 100 })],
        },
      };

      const services = await createServices(opts);
      expect(!!services).toStrictEqual(true);

      await services.destroy();
    });
  });

  it('reuses existing services', async () => {
    await withTemporaryFolder(async (dir) => {
      const opts = {
        dir,
        database: {
          migrations: join(dir, 'migrations'),
          wal: false,
        },
        files: {
          thumbnails: [jpeg({ size: 100 })],
        },
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
