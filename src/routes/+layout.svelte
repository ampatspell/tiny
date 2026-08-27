<script lang="ts">
  import Guard from '$lib/tiny/auth/guard/guard.svelte';
  import { validatePrefix } from '$lib/tiny/auth/guard/guard.svelte.js';
  import { setBroadcastChannel } from '$lib/tiny/broadcast.svelte.js';

  let { children } = $props();

  setBroadcastChannel();

  let validate = validatePrefix({
    prefix: '/_admin',
    role: 'admin',
  });
</script>

<Guard {validate}>
  {@render children()}
</Guard>
