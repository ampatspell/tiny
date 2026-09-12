<script module lang="ts">
  export type ItemState = 'regular' | 'critical';
  export type ItemVariant = 'regular' | 'bordered';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    state = 'regular',
    variant = 'regular',
    isSelected,
    onClick,
    children,
  }: {
    state?: ItemState;
    variant?: ItemVariant;
    isSelected?: boolean;
    onClick: () => void;
    children: Snippet;
  } = $props();

  let onclick = () => onClick();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={['item', `state-${state}`, `variant-${variant}`]} class:selected={isSelected} {onclick}>
  {@render children()}
</div>

<style lang="scss">
  .item {
    --height: 26px;
    &.variant-regular {
      --border: none;
    }
    &.variant-bordered {
      --border: 1px solid var(--tiny-border-color-1);
    }
    &.state-critical {
      --hover-color: var(--tiny-critical);
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: var(--height);
    min-height: var(--height);
    border: var(--border);
    padding: 0 10px;
    min-width: 0;
    width: 100%;
    border-radius: 3px;
    cursor: default;
    transition:
      0.15s ease-in-out background-color,
      0.15s ease-in-out color;
    &:hover {
      color: var(--hover-color);
      background: var(--tiny-selected-background-color-1);
    }
    &.selected {
      color: var(--hover-color);
      background: var(--tiny-selected-background-color-2);
    }
  }
</style>
