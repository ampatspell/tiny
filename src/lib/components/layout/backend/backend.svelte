<script lang="ts">
  import Backend from '$lib/components/backend/backend.svelte';
  import Dark from '$lib/components/dark.svelte';
  import Floaters from '$lib/components/floating/floaters.svelte';
  import { setFloaters } from '$lib/components/floating/floaters.svelte.js';
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
