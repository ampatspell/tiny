import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    sveltekit({
      inspector: {
        toggleKeyCombo: 'alt-x',
      },
      compilerOptions: {
        runes: true,
        experimental: { async: true },
      },
      adapter: adapter(),
      experimental: { remoteFunctions: true },
    }),
  ],
  build: {
    rolldownOptions: {
      external: [
        '@clack/prompts',
        'better-sqlite3',
        'dedent',
        'fs-extra',
        'jsonwebtoken',
        'kysely',
        'kysely-codegen',
        'launch-editor',
        'sharp',
        'tinyexec',
      ],
    },
  },
  test: {
    expect: {
      requireAssertions: true,
    },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
});
