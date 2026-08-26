<script lang="ts">
  import Tiny from '$lib/tiny/tiny.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<Tiny>
  {@render children()}
</Tiny>
