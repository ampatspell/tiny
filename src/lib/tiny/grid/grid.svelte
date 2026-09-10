<script lang="ts" generics="T">
  import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
  import Placeholder from '#lib/tiny/placeholder.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { px } from '#lib/tiny/utils/style.js';
  import type { Snippet } from 'svelte';
  import type { AspectRatio } from '../utils/aspect-ratio.ts';
  import { getActiveInputElement } from '../utils/dom.ts';
  import { setGridContext, type Direction } from './model.svelte.ts';

  let {
    models,
    padding,
    gap,
    aspectRatio,
    selected,
    onSelect: _onSelect,
    children,
  }: {
    models: T[];
    padding?: number;
    gap?: number;
    aspectRatio?: AspectRatio;
    selected?: T | undefined;
    onSelect?: (value: T | undefined) => void;
    children: Snippet<[{ model: T; isSelected: boolean }]>;
  } = $props();

  let width = $state<number>();

  let context = setGridContext<T>({
    selected: getter(() => selected),
    models: getter(() => models),
    width: getter(() => width),
    padding: getter(() => padding),
    gap: getter(() => gap),
    aspectRatio: getter(() => aspectRatio),
  });

  let size = $derived(context.size);

  let onSelect = (e: MouseEvent, model: T) => {
    e.stopPropagation();
    _onSelect?.(model);
  };

  let onClickOutside = () => {
    _onSelect?.(undefined);
  };

  let onKey = (e: KeyboardEvent) => {
    if (!getActiveInputElement()) {
      if (e.key === 'Escape') {
        _onSelect?.(undefined);
      } else {
        let map: { [key: string]: Direction } = {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'up',
          ArrowDown: 'down',
        };
        let direction = map[e.key];
        if (direction) {
          let next = context.navigate(direction);
          if (next) {
            e.stopPropagation();
            _onSelect?.(next);
          }
        }
      }
    }
  };
</script>

<svelte:window onkeydown={onKey} />

{#snippet item(model: T)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="item"
    style:--width={px(context.item?.width)}
    style:--height={px(context.item?.height)}
    onclick={(e) => onSelect(e, model)}
  >
    {@render children({ model, isSelected: model === selected })}
  </div>
{/snippet}

<div class="grid" style:--gap={px(context.gap)} style:--padding={px(context.padding)} bind:clientWidth={width}>
  {#if models.length}
    {#if size}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="overflow" onclick={onClickOutside}>
        <div class="content" style:--width={px(size.width)}>
          {#each models as model (model)}
            {@render item(model)}
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <Placeholder label="No files yet" icon={TablerPhoto} />
  {/if}
</div>

<style lang="scss">
  .grid {
    flex: 1;
    overflow: hidden;
    user-select: none;
    position: relative;
    display: flex;
    flex-direction: column;
    > .overflow {
      position: absolute;
      top: var(--padding);
      left: var(--padding);
      bottom: var(--padding);
      right: var(--padding);
      overflow: auto;
      > .content {
        width: var(--width);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--gap);
        > .item {
          display: flex;
          flex-direction: column;
          width: var(--width);
          height: var(--height);
        }
      }
    }
  }
</style>
