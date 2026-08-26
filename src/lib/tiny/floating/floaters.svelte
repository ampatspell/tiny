<script lang="ts">
  import Floater from './floater.svelte';
  import { useFloaters } from './floaters.svelte.ts';

  let floaters = useFloaters();
</script>

{#each floaters.all as floater (floater)}
  <Floater {floater} />
{/each}
