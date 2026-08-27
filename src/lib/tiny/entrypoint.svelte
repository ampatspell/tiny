<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ValidateFunction } from './auth/guard/guard.svelte.ts';
  import Guard from './auth/guard/guard.svelte';
  import { setBroadcastChannel } from './broadcast.svelte.ts';

  let { children, validate }: { children: Snippet; validate?: ValidateFunction } = $props();

  setBroadcastChannel();
</script>

<Guard {validate}>
  {@render children()}
</Guard>
