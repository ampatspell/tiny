<script lang="ts">
  import { validatePrefix } from '#lib/tiny/auth/guard/validate.svelte.js';
  import Entrypoint from '#lib/tiny/entrypoint/entrypoint.svelte';
  import { setTiny } from '#lib/tiny/entrypoint/tiny.svelte.js';
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

<Entrypoint>
  {@render children()}
</Entrypoint>
