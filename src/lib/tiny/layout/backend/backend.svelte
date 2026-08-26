<script lang="ts">
  import Tiny from '$lib/tiny/tiny.svelte';
  import Floaters from '$lib/tiny/floating/floaters.svelte';
  import { setFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import Backend from '$lib/tiny/backend/backend.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let floaters = setFloaters();
</script>

<Tiny>
  <Backend>
    {@render children()}
  </Backend>
</Tiny>

<Floaters {floaters} />
