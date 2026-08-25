import { defineConfig, type Plugin } from 'vite';

const banner = (): Plugin => {
  return {
    name: 'banner',
    banner: async () => {
      return '#! /usr/bin/env node';
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [banner()],
  build: {
    minify: mode === 'production',
    target: 'node26',
    ssr: true,
    lib: {
      entry: 'src/lib/tiny/tools/cli.ts',
      name: 'cli',
      fileName: () => `cli.js`,
      formats: ['es'],
    },
    outDir: '.cli',
  },
}));
