<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'regular',
    sidebar,
    children,
  }: {
    variant: 'regular' | 'reversed';
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
    flex: 1;
    display: flex;
    > .sidebar {
      width: 260px;
      display: flex;
      flex-direction: column;
      &:empty {
        display: none;
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    &.variant-regular {
      flex-direction: row;
      > .sidebar {
        border-right: 1px solid var(--tiny-border-color-1);
      }
    }
    &.variant-reversed {
      flex-direction: row-reverse;
      > .sidebar {
        width: 320px;
        border-left: 1px solid var(--tiny-border-color-1);
      }
    }
  }
</style>
