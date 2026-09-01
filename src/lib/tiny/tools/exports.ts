import { glob, readFile, writeFile } from 'node:fs/promises';
import { run } from '../utils/utils.ts';
import { basename, dirname, join, relative } from 'node:path';
import { isTruthy } from '../utils/array.ts';

run(async () => {
  const dir = join(import.meta.dirname, '..');
  const pattern = `${dir}/**/*.{ts,svelte,svelte.ts}`;
  const exports: Record<string, unknown> = {
    '.': {
      types: './dist/index.d.ts',
      svelte: './dist/index.js',
    },
    './package.json': './package.json',
  };

  const blacklistFor = async (entry: string) => {
    const local = dirname(entry);
    try {
      const contents = await readFile(join(local, '.blacklist'), 'utf-8');
      return contents.split('\n').filter(isTruthy);
    } catch (err) {
      if (typeof err === 'object' && (err as Record<string, unknown>).code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  };

  const isIgnored = async (entry: string) => {
    const blacklist = await blacklistFor(entry);
    if (blacklist.includes('*')) {
      return true;
    }

    const filename = basename(entry);
    return blacklist.includes(filename);
  };

  const add = (name: string, content: Record<string, unknown>) => {
    if (exports[name]) {
      console.log('Duplicate export', name);
    }
    exports[name] = content;
  };

  for await (const entry of glob(pattern)) {
    const path = relative(dir, entry);
    const clean = path.substring(0, path.indexOf('.'));
    if (!(await isIgnored(entry))) {
      if (path.endsWith('.svelte')) {
        add(`./${clean}`, {
          types: `./dist/tiny/${clean}.svelte.d.ts`,
          svelte: `./dist/tiny/${clean}.svelte`,
        });
      } else if (path.endsWith('.svelte.ts')) {
        add(`./${clean}`, {
          types: `./dist/tiny/${clean}.svelte.d.ts`,
          svelte: `./dist/tiny/${clean}.svelte.js`,
        });
      } else if (path.endsWith('.remote.ts')) {
        exports[`./${clean}.remote`] = {
          types: `./dist/tiny/${clean}.remote.d.ts`,
          svelte: `./dist/tiny/${clean}.remote.js`,
        };
      } else if (path.endsWith('.ts')) {
        exports[`./${clean}`] = {
          types: `./dist/tiny/${clean}.d.ts`,
          svelte: `./dist/tiny/${clean}.js`,
        };
      }
    }
  }

  const pkg = join(import.meta.dirname, '../../../../package.json');
  const json = JSON.parse(await readFile(pkg, 'utf-8'));
  json.exports = exports;
  await writeFile(pkg, JSON.stringify(json, null, 2));
});
