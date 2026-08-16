<script lang="ts">
  import Floater from './floater.svelte';
  import type { Floaters } from './models.svelte.ts';

  let { floaters }: { floaters: Floaters } = $props();
</script>

{#each floaters.all as floater (floater)}
  <Floater {floater} />
{/each}
