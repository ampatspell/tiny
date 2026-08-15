import { log, outro } from '@clack/prompts';
import type { Project } from './project.ts';
import { x } from 'tinyexec';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import dedent from 'dedent';

export const bootstrapProject = async (project: Project) => {
  const root = project.root;
  {
    log.step('Install kysely and valibot');
    await x('npm', ['install', 'valibot', 'kysely', '--save']);
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

      ARG GITHUB_TOKEN

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
    filename: 'vite.config.ts',
    content: dedent`
      import adapter from '@sveltejs/adapter-node';
      import { sveltekit } from '@sveltejs/kit/vite';
      import { defineConfig } from 'vite';

      export default defineConfig({
        plugins: [
          sveltekit({
            compilerOptions: {
              runes: true,
              experimental: {
                async: true,
              },
            },
            adapter: adapter(),
            experimental: {
              explicitEnvironmentVariables: true,
              handleRenderingErrors: true,
              remoteFunctions: true,
              sendWarningsToBrowser: true
            }
          })
        ]
      });
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
    `,
  });

  await write({
    filename: 'src/env.ts',
    content: dedent`
      import * as v from 'valibot';
      import { defineEnvVars } from '@sveltejs/kit/env';
      import { building } from '$app/env';

      export const variables = defineEnvVars({
        STORAGE_ROOT: {
          schema: building ? v.optional(v.string()) : v.string(),
        },
      });
    `,
  });

  await write({
    filename: 'src/hooks.server.ts',
    content: dedent`
      import { STORAGE_ROOT } from '$app/env/private';
      import { createHandle } from '@ampatspell/tiny/server/handle';

      export const handle = createHandle({ storageRoot: STORAGE_ROOT });
    `,
  });

  await write({
    filename: 'src/routes/files/[id]/+server.ts',
    content: dedent`
      import { getFiles } from '@ampatspell/tiny/server/handle';
      import { type RequestHandler } from '@sveltejs/kit';

      export const GET: RequestHandler = ({ params: { id } }) => getFiles().stream({ id });
    `,
  });

  await write({
    filename: 'src/lib/hello.remote.ts',
    content: dedent`
      import { query } from '$app/server';
      import { sql } from 'kysely';
      import { getDatabase } from '@ampatspell/tiny/server/handle';

      export const getMessage = query(async () => {
        const db = getDatabase();
        const {
          rows: [{ message }],
        } = await sql<{ message: string }>\`select 'Welcome to Tiny' as message\`.execute(db);

        return message;
      });
    `,
  });

  await write({
    filename: 'src/routes/+layout.svelte',
    content: dedent`
      <script lang="ts">
        import favicon from '$lib/assets/favicon.svg';
        import Dark from '@ampatspell/tiny/components/dark.svelte';

        let { children } = $props();
      </script>

      <svelte:head>
        <link rel="icon" href={favicon} />
      </svelte:head>

      <Dark>
        {@render children()}
      </Dark>
    `,
  });

  await write({
    filename: 'src/routes/+page.svelte',
    content: dedent`
      <script lang="ts">
        import { getMessage } from '$lib/hello.remote';

        let message = $derived(await getMessage());
      </script>

      <div class="page">
        <div class="welcome">{message}</div>
      </div>

      <style lang="scss">
        .page {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      </style>
    `,
  });

  outro('Base setup and demo was added');
};
