import { sql } from 'kysely';
import { describe, it, expect } from 'vitest';
import { withTemporaryFolder } from './helpers/utils.ts';
import { join, resolve } from 'node:path';
import dedent from 'dedent';
import { mkdir, writeFile } from 'node:fs/promises';
import { createDatabaseServices } from '$lib/tiny/server/database/database.js';

describe('database services', () => {
  it('creates', async () => {
    const services = await createDatabaseServices({
      file: ':memory:',
    });
    expect(services.filename).toStrictEqual(':memory:');
    expect(services.sqlite.memory).toStrictEqual(true);
  });

  it('creates working kysely', async () => {
    const services = await createDatabaseServices({
      file: ':memory:',
    });
    expect(await sql`select 'Hello' as message`.execute(services.db)).toStrictEqual({
      rows: [{ message: 'Hello' }],
    });
  });

  describe('kysely', () => {
    it('works with generic type', async () => {
      await withTemporaryFolder(async (dir) => {
        interface Duck {
          id: string;
          name: string;
        }

        interface DB {
          ducks: Duck;
        }

        const { db: db } = await createDatabaseServices<DB>({
          file: join(dir, 'test.db'),
        });

        await db.schema
          .createTable('ducks')
          .addColumn('id', 'text', (col) => col.notNull().primaryKey())
          .addColumn('name', 'text', (col) => col.notNull())
          .execute();

        const ret = await db
          .insertInto('ducks')
          .returningAll()
          .values({ id: 'yellow', name: 'Yellow' })
          .executeTakeFirstOrThrow();

        expect(ret).toStrictEqual({ id: 'yellow', name: 'Yellow' });
      });
    });
  });

  it('generates schema from database', async () => {
    await withTemporaryFolder(async (dir) => {
      const services = await createDatabaseServices({
        file: join(dir, 'test.db'),
      });

      await services.db.schema
        .createTable('ducks')
        .addColumn('id', 'text', (col) => col.notNull().primaryKey())
        .addColumn('name', 'text', (col) => col.notNull())
        .execute();

      const duck = dedent`
        export interface Duck {
          id: string;
          name: string;
        }
      `;
      const generated = await services.schema.generate();
      expect(generated.includes(duck)).toStrictEqual(true);
    });
  });

  it('migrates to the latest version', async () => {
    await withTemporaryFolder(async (dir) => {
      const migrations = join(dir, 'migrations');
      const services = await createDatabaseServices({
        file: join(dir, 'test.db'),
      });

      const migration = dedent`
          import { Kysely } from 'kysely';

          export const up = async (db: Kysely<any>) => {
            await db.schema
              .createTable('ducks')
              .addColumn('id', 'text', (col) => col.notNull().primaryKey())
              .addColumn('name', 'text', (col) => col.notNull())
              .execute();
          };

          export const down = async (db: Kysely<any>) => {
          };
        `;

      await mkdir(migrations, { recursive: true });
      await writeFile(join(migrations, 'foo.ts'), migration, 'utf-8');

      const migrated = await services.migrate({ migrations }).toLatest();
      expect(migrated).toStrictEqual(true);

      const generated = await services.schema.generate();
      const duck = dedent`
        export interface Duck {
          id: string;
          name: string;
        }
      `;
      expect(generated.includes(duck)).toStrictEqual(true);
    });
  });

  it('migrates using default migrations', async () => {
    await withTemporaryFolder(async (dir) => {
      const migrations = resolve(join(import.meta.dirname, '../lib/tiny/database/migrations'));
      const services = await createDatabaseServices({
        file: join(dir, 'test.db'),
      });
      await services.migrate({ migrations }).toLatest();
      const tables = await services.db.introspection.getTables();
      expect(tables.map((table) => table.name)).toStrictEqual(['file_variants', 'files', 'galleries', 'index']);
    });
  });
});
