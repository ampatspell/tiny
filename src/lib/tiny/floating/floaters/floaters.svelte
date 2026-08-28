<script lang="ts">
  import Floater from '../floater/floater.svelte';
  import { useFloaters } from './model.svelte.ts';

  let floaters = useFloaters();
</script>

{#each floaters.all as floater (floater)}
  <Floater {floater} />
{/each}
