import { log, outro } from '@clack/prompts';
import type { Project } from './project.ts';
import { x } from 'tinyexec';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import dedent from 'dedent';
import { format } from 'date-fns';
import launchEditor from 'launch-editor';
import { isTruthy } from '../utils/array.ts';
import crypto from 'node:crypto';

export const bootstrapProject = async (project: Project, tiny: Project) => {
  const root = project.root;
  const dir = parse(root).name;

  const secret = () => {
    const buffer = crypto.randomBytes(32);
    return buffer.toHex();
  };

  {
    log.step('Install kysely, valibot and better-sqlite3');
    await x('npm', ['install', 'valibot', 'kysely', 'better-sqlite3', '--save']);
  }
  {
    log.step('Install sass-embedded and @sveltejs/adapter-node');
    await x('npm', ['install', 'sass-embedded', '@sveltejs/adapter-node@next', '--save-dev']);
  }
  {
    log.step('Add .local to .gitignore');
    const path = join(root, '.gitignore');
    let string = await readFile(path, 'utf-8');
    string = [string, '/.local', ''].join('\n');
    await writeFile(path, string);
  }
  {
    log.step('Update package.json');
    const path = join(root, 'package.json');
    const json = JSON.parse(await readFile(path, 'utf-8'));
    json.scripts.flc = 'npm run format && npm run check && npm run lint';
    json.scripts.start = 'tiny migrate-to-latest && node build';
    await writeFile(path, JSON.stringify(json, null, 2));
  }

  const write = async ({ filename, content }: { filename: string; content: string }) => {
    log.step(`Add ${filename}`);
    const path = join(root, filename);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${content}\n`);
  };

  await write({
    filename: '.vscode/settings.json',
    content: dedent`
      {
        "editor.formatOnSave": true,
      }
    `,
  });

  await write({
    filename: 'Dockerfile',
    content: dedent`
      FROM node:26-alpine

      WORKDIR /app

      RUN apk update
      RUN apk add --no-cache coreutils curl

      COPY package*.json .
      COPY .npmrc .
      RUN npm ci
      COPY . .

      RUN npm run build

      EXPOSE 3000

      ENV NODE_ENV=production
      CMD [ "npm", "start" ]

      HEALTHCHECK --interval=1m --timeout=10s --start-period=5s --retries=10 CMD curl -f http://localhost:3000 || exit 1
    `,
  });

  await write({
    filename: 'docker-compose.yml',
    content: dedent`
      services:
        ${dir}:
          build: .
          pull_policy: build
          environment:
            - STORAGE_ROOT=/data
            - USERS_SECRET=$USERS_SECRET
            - BODY_SIZE_LIMIT=100M
          volumes:
            - data:/data
          restart: unless-stopped

      volumes:
        data:
    `,
  });

  await write({
    filename: 'prettier.config.js',
    content: dedent`
      /** @type {import("prettier").Config} */
      const config = {
        useTabs: false,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 120,
        plugins: ['prettier-plugin-svelte'],
        overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
      };

      export default config;
    `,
  });

  await write({
    filename: '.env',
    content: dedent`
      STORAGE_ROOT=.local
      USERS_SECRET=${secret()}
    `,
  });

  await write({
    filename: 'src/env.ts',
    content: dedent`
      import * as v from 'valibot';
      import { defineEnvVars } from '@sveltejs/kit/env';
      import { building } from '$app/env';

      const string = () => {
        return building ? v.optional(v.string()) : v.string();
      };

      export const variables = defineEnvVars({
        STORAGE_ROOT: {
          schema: string(),
        },
        USERS_SECRET: {
          schema: string(),
        },
      });
    `,
  });

  await write({
    filename: 'src/hooks.server.ts',
    content: dedent`
      import { STORAGE_ROOT, USERS_SECRET } from '$app/env/private';
      import { jpeg } from '@ampatspell/tiny/server/files/thumbnails';
      import { createHandle } from '@ampatspell/tiny/server/services/handle';
      import { createBasicLogger } from '@ampatspell/tiny/server/utils';

      export const handle = createHandle({
        dir: STORAGE_ROOT,
        users: {
          secret: USERS_SECRET,
        },
        files: {
          thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 }), jpeg({ size: 2048 })],
        },
        logger: createBasicLogger(),
      });
    `,
  });

  await write({
    filename: 'src/lib/services.ts',
    content: dedent`
      import { createServiceGetters } from '@ampatspell/tiny/server/services/handle';
      import type { DB } from './schema';

      export const { getDatabase, getFiles, getStorage, getUsers } = createServiceGetters<DB>();
    `,
  });

  await write({
    filename: 'src/params.ts',
    content: dedent`
      import { defineParams } from '@sveltejs/kit/params';
      import * as v from 'valibot';

      export const params = defineParams({
        variants: v.union([v.literal('100x100'), v.literal('1024x1024'), v.literal('2048x2048')]),
      });
    `,
  });

  await write({
    filename: 'src/lib/message/message.remote.ts',
    content: dedent`
      import { getDatabase, getFiles } from '#lib/services.js';
      import { command, query } from '$app/server';
      import { uid } from '@ampatspell/tiny/server/utils';
      import { hasKeys, omit } from '@ampatspell/tiny/utils/object';
      import type { QueryResponse } from '@ampatspell/tiny/utils/utils';
      import { readFile } from 'fs/promises';
      import { fileURLToPath } from 'url';
      import * as v from 'valibot';

      export const getMessage = query(async () => {
        let record = await getDatabase().selectFrom('messages').selectAll().executeTakeFirst();
        if (!record) {
          const backgroundId = uid();
          const buffer = await readFile(fileURLToPath(import.meta.resolve('@ampatspell/tiny/assets/film-0677-011.jpg')));
          const file = new File([buffer], 'film-0677-011.jpg', { type: 'image/jpeg' });
          await getFiles().store(backgroundId, file);

          record = await getDatabase()
            .insertInto('messages')
            .values({
              id: uid(),
              message: 'To whom it may concern: It is springtime. It is late afternoon.',
              backgroundId,
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        }

        let background;
        if (record.backgroundId) {
          background = await getFiles().data(record.backgroundId);
        }

        return {
          ...record,
          background,
        };
      });

      export type MessageData = QueryResponse<typeof getMessage>;

      export const updateMessage = command(
        v.strictObject({
          message: v.optional(v.string()),
          background: v.optional(v.strictObject({ file: v.optional(v.file()) })),
        }),
        async (arg) => {
          const props = omit(arg, ['background']);
          const { background } = arg;
          const db = getDatabase();
          if (background) {
            const files = getFiles();
            const record = await db.selectFrom('messages').selectAll().executeTakeFirstOrThrow();
            if (record.backgroundId) {
              await files.drop(record.backgroundId);
            }
            let backgroundId = null;
            if (background.file) {
              backgroundId = uid();
              await files.store(backgroundId, background.file);
            }
            await db.updateTable('messages').set({ backgroundId }).execute();
          }
          if (hasKeys(props)) {
            await db.updateTable('messages').set(props).execute();
          }
          getMessage().refresh();
        },
      );
    `,
  });

  await write({
    filename: 'src/lib/message/message.svelte.ts',
    content: dedent`
      import { getter, options, type OptionsInput } from '@ampatspell/tiny/utils/options';
      import { updateMessage, type MessageData } from './message.remote';
      import { notBlank } from '@ampatspell/tiny/properties/validator';
      import { type BroadcastChannel } from '@ampatspell/tiny/broadcast';
      import { asFile } from '@ampatspell/tiny/utils/files';
      import { images } from '@ampatspell/tiny/utils/utils';
      import { withDataFields } from '@ampatspell/tiny/fields/data';

      export type MessageModelOptions = Readonly<{
        data: MessageData;
        broadcast: BroadcastChannel;
      }>;

      export const useMessageModel = (_opts: OptionsInput<MessageModelOptions>) => {
        const opts = options(_opts);
        const broadcast = $derived(opts.broadcast);
        const data = $derived(opts.data);

        const [fields, state] = withDataFields({
          data: getter(() => ({
            ...data,
            background: asFile(data.background),
          })),
        }).define(({ string, file }) => ({
          message: string('message', { validator: notBlank() }),
          background: file('background', { accept: images }),
        }));

        const save = async () => {
          if (state.touch()) {
            const data = state.serialized.dirty;
            if (data) {
              await updateMessage(data);
              broadcast.notifyDidSave();
            }
          }
        };

        return options({
          ...fields,
          ...state.opts,
          save,
        });
      };
    `,
  });

  await write({
    filename: 'src/lib/message/public.svelte',
    content: dedent`
      <script lang="ts">
        import { url } from '@ampatspell/tiny/utils/style';
        import { getMessage } from './message.remote';
        import { resolve } from '$app/paths';
        import pkg from '@ampatspell/tiny/package.json';

        let record = $derived(await getMessage());
        let background = $derived.by(() => {
          const id = record.backgroundId;
          if (id) {
            return resolve('/files/[id]/[variant=variants]', { id, variant: '2048x2048' });
          }
        });
        let version = pkg.version;
      </script>

      <div class="page" style:--background={url(background)}>
        <div class="content">
          <div class="message">
            <div>{record.message}</div>
            <div>Welcome to Tiny v{version}</div>
            <div><a href={resolve('/(tiny)/_admin/(nav)')}>admin →</a></div>
          </div>
        </div>
      </div>

      <style lang="scss">
        .page {
          flex: 1;
          position: relative;
          overflow: hidden;
          > .content {
            position: absolute;
            --offset: -30px;
            top: var(--offset);
            right: var(--offset);
            bottom: var(--offset);
            left: var(--offset);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--background) center center / cover no-repeat;
            > .message {
              font-size: var(--tiny-font-size-small);
              color: #000;
              display: flex;
              flex-direction: column;
            }
          }
        }
      </style>
    `,
  });

  await write({
    filename: 'src/lib/migrations/2026-09-01-16-01-23-migration.ts',
    content: dedent`
      /* eslint-disable @typescript-eslint/no-explicit-any */
      import { Kysely } from 'kysely';

      export const up = async (db: Kysely<any>) => {
        await db.schema
          .createTable('messages')
          .addColumn('id', 'text', (col) => col.notNull().primaryKey())
          .addColumn('message', 'text', (col) => col.notNull())
          .addColumn('background_id', 'text')
          .execute();
      };

      export const down = async (db: Kysely<any>) => {
        await db.schema.dropTable('messages').execute();
      };
    `,
  });

  await write({
    filename: 'src/lib/services.ts',
    content: dedent`
      import { createServiceGetters } from '@ampatspell/tiny/server/services/handle';
      import type { DB } from './schema';

      export const { getDatabase, getFiles, getStorage, getUsers } = createServiceGetters<DB>();
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/_admin/(nav)/message/+page.svelte',
    content: dedent`
      <script lang="ts">
        import { getMessage } from '#lib/message/message.remote.js';
        import { useMessageModel } from '#lib/message/message.svelte.js';
        import { useBroadcastChannel } from '@ampatspell/tiny/broadcast';
        import Content from '@ampatspell/tiny/form/content/content';
        import Fields from '@ampatspell/tiny/form/content/fields';
        import Form from '@ampatspell/tiny/form/form';
        import Editing from '@ampatspell/tiny/layout/editing/editing';
        import { useEditingLayout } from '@ampatspell/tiny/layout/editing/layout';
        import { getter } from '@ampatspell/tiny/utils/options';

        let broadcast = useBroadcastChannel();
        let data = $derived(await getMessage());
        let model = useMessageModel({
          data: getter(() => data),
          broadcast,
        });
        let layout = useEditingLayout({ model, title: 'Message' });
      </script>

      <Editing {layout}>
        <Form size="wide">
          <Content>
            <Fields field={model.message} />
            <Fields field={model.background} />
          </Content>
        </Form>
      </Editing>
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/_admin/(nav)/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import { resolve } from '$app/paths';
        import Backend from '@ampatspell/tiny/backend/backend';
        import { setBackend } from '@ampatspell/tiny/backend/context';
        import { equals } from '@ampatspell/tiny/backend/navigation/model';
        import Floaters from '@ampatspell/tiny/floating/floaters/floaters';
        import { setFloaters } from '@ampatspell/tiny/floating/floaters/model';
        import LucideCat from '@ampatspell/tiny/icons/lucide--cat';
        import TablerBalloon from '@ampatspell/tiny/icons/tabler--balloon';
        import TablerCloud from '@ampatspell/tiny/icons/tabler--cloud';
        import type { Snippet } from 'svelte';

        let { children }: { children: Snippet } = $props();

        setBackend({
          items: [
            {
              name: 'Public',
              icon: TablerCloud,
              route: resolve('/'),
              cmp: equals,
            },
            {
              name: 'Cat',
              icon: LucideCat,
              route: resolve('/(tiny)/_admin/(nav)'),
              cmp: equals,
            },
            {
              name: 'Message',
              icon: TablerBalloon,
              route: resolve('/(tiny)/_admin/(nav)/message'),
            },
          ],
        });

        setFloaters();
      </script>

      <svelte:head>
        <title>Tiny _admin</title>
      </svelte:head>

      <Backend>
        {@render children()}
      </Backend>

      <Floaters />
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/_admin/(nav)/+page.svelte',
    content: dedent`
      <script lang="ts">
        import Placeholder from '@ampatspell/tiny/layout/placeholder/placeholder';
      </script>

      <Placeholder />
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/_admin/+layout.ts',
    content: dedent`
      export const ssr = false;
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import Tiny from '@ampatspell/tiny/tiny';

        let { children } = $props();
      </script>

      <Tiny>
        {@render children()}
      </Tiny>
    `,
  });

  await write({
    filename: 'src/routes/files/[id]/[variant=variants]/+server.ts',
    content: dedent`
      import { getFiles } from '#lib/services.js';
      import { type RequestHandler } from '@sveltejs/kit';

      export const GET: RequestHandler = async ({ params: { id, variant } }) => {
        const file = await getFiles().get({ id, variant });
        return file.toResponse();
      };
    `,
  });

  await write({
    filename: 'src/routes/+error.svelte',
    content: dedent`
      <script lang="ts">
        import Error from '@ampatspell/tiny/error';
      </script>

      <svelte:head>
        <title>Tiny issue</title>
      </svelte:head>

      <Error />
    `,
  });

  await write({
    filename: 'src/routes/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import { validatePrefix } from '@ampatspell/tiny/auth/guard/validate';
        import Entrypoint from '@ampatspell/tiny/entrypoint';

        let { children } = $props();

        let validate = validatePrefix({
          prefix: '/_admin',
          role: 'admin',
        });
      </script>

      <Entrypoint {validate}>
        {@render children()}
      </Entrypoint>
    `,
  });

  await write({
    filename: 'src/routes/+page.svelte',
    content: dedent`
      <script lang="ts">
        import Public from '#lib/message/public.svelte';
        import Tiny from '@ampatspell/tiny/tiny';
      </script>

      <svelte:head>
        <title>Tiny</title>
      </svelte:head>

      <Tiny>
        <Public />
      </Tiny>
    `,
  });

  await write({
    filename: 'src/app.html',
    content: dedent`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <link rel="icon" href="%sveltekit.assets%/favicon.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="text-scale" content="scale" />
          %sveltekit.head%
        </head>

        <body data-sveltekit-preload-data="hover">
          <div style="display: contents">%sveltekit.body%</div>
        </body>
      </html>
    `,
  });

  {
    log.step('Copy favicon.png');
    await copyFile(join(tiny.root, 'static/favicon.png'), join(project.root, 'static/favicon.png'));
  }

  {
    log.step('Delete .svelte-kit');
    await x('rm', ['-rf', join(root, '.svelte-kit')]);
  }

  {
    log.step('Migrate');
    await x('npx', ['tiny', 'migrate-to-latest']);
  }

  {
    log.step('Generate schema.d.ts');
    await x('npx', ['tiny', 'generate-schema']);
  }

  {
    log.step('Format');
    await x('npm', ['run', 'format']);
  }

  outro('Alright, done');
};

export const generateMigrationFile = async (project: Project) => {
  const { isTiny, migrationsRoot } = project;

  const template = dedent`
    /* eslint-disable @typescript-eslint/no-explicit-any */
    import { Kysely } from "kysely";

    export const up = async (db: Kysely<any>) => {
    }

    export const down = async (db: Kysely<any>) => {
    }
  `;

  const name = [
    format(new Date(), 'yyyy-MM-dd-HH-mm-ss'),
    [isTiny && 'tiny', 'migration.ts'].filter(isTruthy).join('-'),
  ].join('-');
  const path = join(migrationsRoot, name);
  await mkdir(migrationsRoot, { recursive: true });
  await writeFile(path, template, 'utf-8');

  outro(`Migration file ${name} has been created`);

  launchEditor(path);
};
