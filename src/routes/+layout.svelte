<script lang="ts">
  import { setBroadcastChannel } from '$lib/tiny/broadcast.svelte.js';

  let { children } = $props();

  setBroadcastChannel();
</script>

{@render children()}
