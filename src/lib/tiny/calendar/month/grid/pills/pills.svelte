<script lang="ts">
  import type { Snippet } from 'svelte';
  import { px } from '#lib/tiny/utils/style.js';

  let { children }: { children?: Snippet } = $props();

  let rect = $state<DOMRectReadOnly>();

  let height = 20;
  let gap = 1;

  let max = $derived.by(() => {
    const total = rect?.height;
    if (total) {
      return Math.floor(total / (height + gap) - gap);
    }
  });

  export { max };
</script>

<div class="pills" bind:contentRect={rect} style:--height={px(height)} style:--gap={px(gap)}>
  {@render children?.()}
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
