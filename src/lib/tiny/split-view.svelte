<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'regular',
    sidebar,
    children,
  }: {
    variant?: 'regular' | 'wide';
    sidebar: Snippet;
    children: Snippet;
  } = $props();
</script>

<div class={['split-view', `variant-${variant}`]}>
  <div class="sidebar">
    {@render sidebar?.()}
  </div>
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .split-view {
    &.variant-regular {
      --sidebar-width: 260px;
    }
    &.variant-wide {
      --sidebar-width: 320px;
    }
    flex: 1;
    display: flex;
    flex-direction: row;
    > .sidebar {
      width: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--tiny-border-color-1);
      &:empty {
        display: none;
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
