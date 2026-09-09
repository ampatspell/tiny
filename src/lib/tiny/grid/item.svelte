<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="item">
  {@render children?.()}
</div>

<style lang="scss">
  .item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    transition: 0.15s ease-in-out background-color;
    &:hover {
      background: var(--tiny-selected-background-color-1);
    }
  }
</style>
