<script module lang="ts">
  export type ItemState = 'regular' | 'critical';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    state,
    onClick,
    children,
  }: {
    state?: ItemState;
    onClick: () => void;
    children: Snippet;
  } = $props();

  let onclick = () => onClick();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={['item', `state-${state ?? 'regular'}`]} {onclick}>
  {@render children()}
</div>

<style lang="scss">
  .item {
    &.state-critical {
      --hover-color: var(--tiny-critical);
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 36px;
    min-height: 36px;
    padding: 0 15px;
    min-width: 0;
    border-radius: 3px;
    cursor: default;
    border-bottom: 1px solid var(--tiny-border-color-2);
    transition:
      0.15s ease-in-out background-color,
      0.15s ease-in-out color;
    &:hover {
      color: var(--hover-color);
      background: var(--tiny-selected-background-color-1);
    }
  }
</style>
