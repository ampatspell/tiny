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
    log.step('Install sass-embedded');
    await x('npm', ['install', 'sass-embedded', '--save-dev']);
  }
  {
    log.step('Add .local to .gitignore');
    const path = join(root, '.gitignore');
    let string = await readFile(path, 'utf-8');
    string = [string, '/.local', ''].join('\n');
    await writeFile(path, string);
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
