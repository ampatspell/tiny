<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, end }: { children?: Snippet; end?: Snippet } = $props();
</script>

<div class="header">
  <div class="section left">{@render children?.()}</div>
  {#if end}
    <div class="section right">{@render end?.()}</div>
  {/if}
</div>

<style lang="scss">
  .header {
    height: 36px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    border-bottom: 1px solid var(--dark-border-color-1);
    > .section {
      padding: 0 10px;
      &.left {
        flex: 1;
      }
    }
  }
</style>
