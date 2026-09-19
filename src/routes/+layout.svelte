<script lang="ts">
  import { validatePrefix } from '#lib/tiny/auth/guard/validate.svelte.js';
  import Hello from '#lib/tiny/hello/hello.svelte';
  import { setTiny } from '#lib/tiny/hello/tiny.svelte.js';
  import { resolve } from '$app/paths';

  let { children } = $props();

  setTiny({
    guard: validatePrefix({
      prefix: '/_admin',
      role: 'admin',
    }),
    files: {
      resolve: ({ id, variant }) => resolve('/files/[id]/[variant=variants]', { id, variant }),
    },
  });
</script>

<Hello>
  {@render children()}
</Hello>
