<script lang="ts">
  import type { Snippet } from 'svelte';
  import Guard from '../auth/guard/guard.svelte';
  import { useTiny } from './tiny.svelte.ts';

  let { children }: { children: Snippet } = $props();

  let tiny = useTiny();
  let validate = $derived(tiny.validate);
</script>

<Guard {validate}>
  {@render children()}
</Guard>
