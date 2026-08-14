<script lang="ts">
  import type { Snippet } from 'svelte';

  let { left, right }: { left?: Snippet; right?: Snippet } = $props();
</script>

<div class="header">
  <div class="section left">{@render left?.()}</div>
  <div class="section right">{@render right?.()}</div>
</div>

<style lang="scss">
  .header {
    height: 36px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid var(--dark-border-color-1);
    > .section {
      &.left {
        flex: 1;
      }
    }
  }
</style>
