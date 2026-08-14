import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      compilerOptions: {
        runes: true,
        experimental: { async: true },
      },
      experimental: {
        explicitEnvironmentVariables: true,
        handleRenderingErrors: true,
        remoteFunctions: true,
        sendWarningsToBrowser: true,
      },
    }),
  ],
});
