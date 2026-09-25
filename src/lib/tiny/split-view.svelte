<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'regular',
    sidebar,
    children,
  }: {
    variant?: 'regular' | 'wide' | 'reverse';
    sidebar?: Snippet;
    children?: Snippet;
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
    --direction: row;
    --border: 1px solid var(--tiny-border-color-1);
    &.variant-regular {
      --sidebar-width: 260px;
      --border-right: var(--border);
    }
    &.variant-wide {
      --sidebar-width: 320px;
      --border-right: var(--border);
    }
    &.variant-reverse {
      --sidebar-width: 320px;
      --direction: row-reverse;
      --border-left: var(--border);
    }
    flex: 1;
    display: flex;
    flex-direction: var(--direction);
    > .sidebar {
      width: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      border-left: var(--border-left);
      border-right: var(--border-right);
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
