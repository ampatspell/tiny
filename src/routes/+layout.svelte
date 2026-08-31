<script lang="ts">
  import { validatePrefix } from '#lib/tiny/auth/guard/validate.svelte.js';
  import Entrypoint from '#lib/tiny/entrypoint.svelte';

  let { children } = $props();

  let validate = validatePrefix({
    prefix: '/_admin',
    role: 'admin',
  });
</script>

<Entrypoint {validate}>
  {@render children()}
</Entrypoint>
