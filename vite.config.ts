import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) => {
          return filename.split(/[/\\]/).includes('node_modules') ? undefined : true;
        },
        experimental: { async: true },
      },
      adapter: adapter(),
      experimental: {
        explicitEnvironmentVariables: true,
        handleRenderingErrors: true,
        remoteFunctions: true,
        sendWarningsToBrowser: true,
      },
    }),
  ],
});
