<script lang="ts">
  import type { Snippet } from 'svelte';

  let { top, children }: { top?: Snippet; children?: Snippet } = $props();
</script>

<div class="list">
  {@render top?.()}
  <div class="content">
    <div class="overflow">
      <div class="content">
        {@render children?.()}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .list {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      position: relative;
      > .overflow {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-y: auto;
        > .content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
      }
    }
  }
</style>
