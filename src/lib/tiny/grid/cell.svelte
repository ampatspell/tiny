<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { px } from '../utils/style.ts';
  import { useGridContext } from './model.svelte.ts';

  let {
    model,
    onSelect: _onSelect,
    children,
  }: {
    model: T;
    onSelect?: (model: T) => void;
    children: Snippet;
  } = $props();

  let context = useGridContext();

  let onclick = (e: MouseEvent) => {
    e.stopPropagation();
    _onSelect?.(model);
  };

  let element = $state<HTMLDivElement>();

  const matches = (arg: T) => arg === model;

  const scrollIntoView = () => {
    element?.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  };

  export { matches, scrollIntoView };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={element}
  class="item"
  style:--width={px(context.item?.width)}
  style:--height={px(context.item?.height)}
  {onclick}
>
  {@render children()}
</div>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: column;
    width: var(--width);
    height: var(--height);
  }
</style>
