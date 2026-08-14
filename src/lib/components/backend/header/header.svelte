<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, right }: { children?: Snippet; right?: Snippet } = $props();
</script>

<div class="header">
  <div class="section left">{@render children?.()}</div>
  {#if right}
    <div class="section right">{@render right?.()}</div>
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
