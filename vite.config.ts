import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      compilerOptions: { runes: true, experimental: { async: true } },
      experimental: {
        explicitEnvironmentVariables: true,
        handleRenderingErrors: true,
        remoteFunctions: true,
        sendWarningsToBrowser: true,
      },
    }),
  ],
  test: {
    expect: { requireAssertions: true },
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
  ssr: {
    external: [
      '@libsql/kysely-libsql',
      '@tediousjs/connection-string',
      'bun:sqlite',
      'tarn',
      'kysely-bun-sqlite',
      'tedious',
      'mysql2',
      'pg',
    ],
  },
});
