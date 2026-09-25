<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DateModel, MonthModel } from '../month.svelte.ts';
  import { px } from '#lib/tiny/utils/style.js';

  let {
    month,
    date: _date,
  }: {
    month: MonthModel;
    date: Snippet<[{ date: DateModel }]>;
  } = $props();

  let positionFor = (idx: number) => {
    let pos = [];
    if (idx < 7) {
      pos.push('top');
    } else if (idx > 34) {
      pos.push('bottom');
    }
    if (idx % 7 === 0) {
      pos.push('left');
    } else if (idx % 7 === 6) {
      pos.push('right');
    }
    return pos;
  };

  let rect = $state<DOMRectReadOnly>();

  let size = $derived.by(() => {
    if (rect) {
      let width = rect.width / 7;
      let height = rect.height / 6;
      return {
        width,
        height,
      };
    }
  });
</script>

<div class="content" bind:contentRect={rect}>
  {#if size}
    <div class="content" style:--cell-width={px(size?.width)} style:--cell-height={px(size?.height)}>
      {#each month.grid as date, idx (idx)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class={[
            'cell',
            'date',
            ...positionFor(idx),
            date.isCurrent && 'current',
            date.isToday && 'today',
            date.isSelected && 'selected',
          ]}
          onclick={date.onSelect}
        >
          <div class="header">
            <div class="day">
              {date.day}
            </div>
          </div>
          <div class="content">
            {@render _date({ date })}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .content {
    flex: 1;
    overflow: hidden;
    position: relative;
    > .content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      user-select: none;
      > .cell {
        width: var(--cell-width);
        height: var(--cell-height);
        display: flex;
        flex-direction: column;
        transition: 0.15s ease-in-out background-color;
        &.date {
          --padding: 5px;
          --background: var(--tiny-white-color);
          --color: var(--tiny-color);
          --border: var(--tiny-border-color-2);
          &.today {
            --background: var(--tiny-selected-background-color-2);
            --color: var(--tiny-color);
          }
          &.selected {
            --background: var(--tiny-color);
            --color: var(--tiny-white-color);
          }
          border-bottom: 1px solid var(--border);
          border-right: 1px solid var(--border);
          &.right {
            border-right: none;
          }
          &.bottom {
            border-bottom: none;
          }
          &:hover {
            background: rgb(from var(--tiny-selected-background-color-1) r g b / 2%);
          }
          > .header {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            padding: var(--padding);
            > .day {
              font-weight: 700;
              width: 26px;
              height: 26px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              color: var(--color);
              background: var(--background);
            }
          }
          > .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: auto;
          }
          &:not(.current) {
            > .header,
            > .content {
              opacity: 0.25;
            }
          }
        }
      }
    }
  }
</style>
