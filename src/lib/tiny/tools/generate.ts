import { log, outro } from '@clack/prompts';
import type { Project } from './project.ts';
import { x } from 'tinyexec';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';
import dedent from 'dedent';
import { format } from 'date-fns';
import launchEditor from 'launch-editor';
import { isTruthy } from '../utils/array.ts';
import crypto from 'node:crypto';

export const bootstrapProject = async (project: Project) => {
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
    await x('npm', ['install', 'sass-embedded', '@sveltejs/adapter-node', '--save-dev']);
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
    await writeFile(path, content);
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
      FROM node:24-alpine

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

      HEALTHCHECK \
        --interval=1m \
        --timeout=10s \
        --start-period=5s \
        --retries=10 \
        CMD curl -f http://localhost:3000 || exit 1
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
        overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
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
          thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 })]
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

      const { getDatabase, getFiles, getStorage, getUsers } = createServiceGetters<DB>();

      export { getDatabase, getFiles, getStorage, getUsers };
    `,
  });

  await write({
    filename: 'src/routes/files/[id]/[variant]/+server.ts',
    content: dedent`
      import { getFiles } from '#lib/services';
      import { type RequestHandler } from '@sveltejs/kit';

      export const GET: RequestHandler = async ({ params: { id, variant } }) => {
        const file = await getFiles().get({ id, variant });
        return file.toResponse();
      };
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/layout.ts',
    content: dedent`
      export const ssr = false;
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import Tiny from '@ampatspell/tiny/tiny.svelte';

        let { children } = $props();
      </script>

      <svelte:head>
        <title>Welcome to Tiny</title>
      </svelte:head>

      <Tiny>
        {@render children()}
      </Tiny>
    `,
  });

  await write({
    filename: 'src/routes/(tiny)/_admin/(nav)/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import { resolve } from '$app/paths';
        import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
        import LucideCat from '#lib/playground/icons/lucide--cat.svelte';
        import TablerAppWindow from '#lib/playground/icons/tabler--app-window.svelte';
        import TablerCode from '#lib/playground/icons/tabler--code.svelte';
        import type { Snippet } from 'svelte';
        import { setBackend } from '#lib/tiny/backend/backend.svelte.js';
        import Floaters from '#lib/tiny/floating/floaters.svelte';
        import { setFloaters } from '#lib/tiny/floating/floaters.svelte.js';
        import Backend from '#lib/tiny/backend/backend.svelte';

        let { children }: { children: Snippet } = $props();

        setBackend({
          items: [
            {
              name: 'Public',
              icon: LucideCat,
              route: resolve('/'),
            },
          ],
        });

        setFloaters();
      </script>

      <svelte:head>
        <title>Tiny backend</title>
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
        import LucideCat from '#lib/playground/icons/lucide--cat.svelte';
        import Placeholder from '#lib/tiny/placeholder.svelte';
      </script>

      <Placeholder icon={LucideCat} label="Welcome to Tiny" />
    `,
  });

  // await write({
  //   filename: 'src/lib/hello.remote.ts',
  //   content: dedent`
  //     import { query } from '$app/server';
  //     import { sql } from 'kysely';
  //     import { getDatabase } from './services';

  //     export const getMessage = query(async () => {
  //       const db = getDatabase();
  //       const {
  //         rows: [{ message }],
  //       } = await sql<{ message: string }>\`select 'Welcome to Tiny' as message\`.execute(db);

  //       return message;
  //     });
  //   `,
  // });

  await write({
    filename: 'src/routes/+error.svelte',
    content: dedent`
      <script lang="ts">
        import Error from '@ampatspell/tiny/error.svelte';
      </script>

      <Error />
    `,
  });

  await write({
    filename: 'src/routes/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import Entrypoint from '@ampatspell/tiny/entrypoint.svelte';
        import { validatePrefix } from '@ampatspell/tiny/auth/guard/validate';

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

  // await write({
  //   filename: 'src/routes/+page.svelte',
  //   content: dedent`
  //     <script lang="ts">
  //       import { getMessage } from '#lib/hello.remote';

  //       let message = $derived(await getMessage());
  //     </script>

  //     <div class="page">
  //       <div class="welcome">{message}</div>
  //     </div>

  //     <style lang="scss">
  //       .page {
  //         flex: 1;
  //         display: flex;
  //         flex-direction: column;
  //         align-items: center;
  //         justify-content: center;
  //       }
  //     </style>
  //   `,
  // });

  // {
  //   log.step('Delete .svelte-kit');
  //   await x('rm', ['-rf', join(root, '.svelte-kit')]);
  // }

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
