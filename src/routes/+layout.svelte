<script lang="ts">
  import { setBroadcastChannel } from '$lib/tiny/broadcast.svelte.js';

  let { children } = $props();

  setBroadcastChannel();
</script>

<svelte:head>
  <title>Welcome to Tiny</title>
</svelte:head>

{@render children()}
