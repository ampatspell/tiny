<script lang="ts">
  import type { Snippet } from 'svelte';

  let { sidebar, children }: { sidebar: Snippet; children: Snippet } = $props();
</script>

<div class="layout">
  <div class="sidebar">
    {@render sidebar?.()}
  </div>
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .layout {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--tiny-border-color-1);
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
