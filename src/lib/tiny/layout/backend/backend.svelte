<script lang="ts">
  import Dark from '$lib/tiny/dark.svelte';
  import Floaters from '$lib/tiny/floating/floaters.svelte';
  import { setFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import Backend from '$lib/tiny/backend/backend.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let floaters = setFloaters();
</script>

<Dark>
  <Backend>
    {@render children()}
  </Backend>
</Dark>

<Floaters {floaters} />
