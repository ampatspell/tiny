import { glob, readFile, writeFile } from 'node:fs/promises';
import { run } from '../utils/utils.ts';
import { join, relative } from 'node:path';

run(async () => {
  const dir = join(import.meta.dirname, '..');
  const pattern = `${dir}/**/*.{ts,svelte,svelte.ts}`;
  const ignore = ['tools', 'server/database/migrations', 'server/database/schema'];
  const exports: Record<string, unknown> = {
    '.': {
      types: './dist/index.d.ts',
      svelte: './dist/index.js',
    },
  };

  for await (const entry of glob(pattern)) {
    const path = relative(dir, entry);
    const clean = path.substring(0, path.indexOf('.'));
    if (!ignore.find((ignore) => path.startsWith(ignore))) {
      if (path.endsWith('.svelte')) {
        exports[`./tiny/${clean}.svelte`] = {
          types: `./dist/tiny/${clean}.svelte.d.ts`,
          svelte: `./dist/tiny/${clean}.svelte`,
          default: `./dist/tiny/${clean}.svelte`,
        };
      } else if (path.endsWith('.svelte.ts')) {
        exports[`./tiny/${clean}`] = {
          types: `./dist/tiny/${clean}.svelte.d.ts`,
          svelte: `./dist/tiny/${clean}.svelte.js`,
          default: `./dist/tiny/${clean}.svelte.js`,
        };
      } else if (path.endsWith('.remote.ts')) {
        exports[`./tiny/${clean}.remote`] = {
          types: `./dist/tiny/${clean}.remote.d.ts`,
          svelte: `./dist/tiny/${clean}.remote.js`,
          default: `./dist/tiny/${clean}.remote.js`,
        };
      } else if (path.endsWith('.ts')) {
        exports[`./tiny/${clean}`] = {
          types: `./dist/tiny/${clean}.d.ts`,
          svelte: `./dist/tiny/${clean}.js`,
          default: `./dist/tiny/${clean}.js`,
        };
      }
    }
  }

  const pkg = join(import.meta.dirname, '../../../../package.json');
  const json = JSON.parse(await readFile(pkg, 'utf-8'));
  json.exports = exports;
  await writeFile(pkg, JSON.stringify(json, null, 2));
});
