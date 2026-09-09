<script lang="ts" generics="T extends object">
  import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
  import Placeholder from '#lib/tiny/placeholder.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { px } from '#lib/tiny/utils/style.js';
  import type { Snippet } from 'svelte';
  import { setGridContext } from './model.svelte.ts';

  let {
    models,
    padding,
    gap,
    selected,
    onSelect,
    children,
  }: {
    models: T[];
    padding?: number;
    gap?: number;
    selected?: T | undefined;
    onSelect?: (value: T | undefined) => void;
    children: Snippet<[{ model: T; isSelected: boolean }]>;
  } = $props();

  let width = $state<number>();

  let context = setGridContext({
    models: getter(() => models),
    width: getter(() => width),
    padding: getter(() => padding),
    gap: getter(() => gap),
  });

  let size = $derived(context.size);
</script>

{#snippet item(model: T)}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="item" style:--size={px(context.item)} onclick={() => onSelect?.(model)}>
    {@render children({ model, isSelected: model === selected })}
  </div>
{/snippet}

<div class="grid" style:--gap={px(context.gap)} style:--padding={px(context.padding)} bind:clientWidth={width}>
  {#if models.length}
    {#if size}
      <div class="overflow">
        <div class="content" style:--width={px(size.width)} style:--height={px(size.height)}>
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
    > .overflow {
      position: absolute;
      top: var(--padding);
      left: var(--padding);
      bottom: var(--padding);
      right: var(--padding);
      overflow: auto;
      > .content {
        width: var(--width);
        height: var(--height);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--gap);
        > .item {
          display: flex;
          flex-direction: column;
          width: var(--size);
          height: var(--size);
        }
      }
    }
  }
</style>
