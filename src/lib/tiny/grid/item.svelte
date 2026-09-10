<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, isSelected }: { children?: Snippet; isSelected: boolean } = $props();
</script>

<div class={['item', isSelected && 'selected']}>
  {@render children?.()}
</div>

<style lang="scss">
  .item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    transition: 0.15s ease-in-out border-color;
    border: 2px solid transparent;
    padding: 1px;
    &.selected {
      border-color: var(--tiny-accent-color-2);
    }
  }
</style>
