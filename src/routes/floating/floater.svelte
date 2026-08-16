<script lang="ts">
  import { onClickOutside } from 'runed';
  import type { Floater } from './models.svelte.ts';

  let { floater }: { floater: Floater } = $props();

  let snippet = $derived(floater.snippet);
  let opts = $derived(floater.opts);

  let element = $state<HTMLDivElement>();

  onClickOutside(
    () => element,
    () => floater.close(),
  );
</script>

<div class="floater" bind:this={element}>{@render snippet(opts)}</div>

<style lang="scss">
  .floater {
  }
</style>
