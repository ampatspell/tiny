<script lang="ts">
  import { px } from '#lib/tiny/utils/style.js';
  import type { Renderable } from '#lib/tiny/render.svelte';
  import Render from '#lib/tiny/render.svelte';

  let { pills }: { pills: Renderable[] } = $props();

  let rect = $state<DOMRectReadOnly>();

  let height = 20;
  let gap = 1;

  let max = $derived.by(() => {
    const total = rect?.height;
    if (total) {
      return Math.floor(total / (height + gap));
    }
    return 0;
  });
</script>

<div class="pills" bind:contentRect={rect} style:--height={px(height)} style:--gap={px(gap)}>
  {#each pills as renderable, idx (idx)}
    {#if idx < max}
      <Render {renderable} />
    {/if}
  {/each}
</div>

<style lang="scss">
  .pills {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    padding: 0 1px;
  }
</style>
