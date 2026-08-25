<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, accessories }: { children?: Snippet; accessories?: Snippet } = $props();
</script>

<div class="header">
  <div class="section left">{@render children?.()}</div>
  {#if accessories}
    <div class="section right">{@render accessories?.()}</div>
  {/if}
</div>

<style lang="scss">
  .header {
    cursor: default;
    height: 36px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    border-bottom: 1px solid var(--dark-border-color-1);
    > .section {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      gap: 5px;
      align-items: center;
      &.left {
        flex: 1;
      }
    }
  }
</style>
