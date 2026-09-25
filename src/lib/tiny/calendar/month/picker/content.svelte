<script lang="ts">
  import type { MonthModel } from '../month.svelte.ts';

  let { month }: { month: MonthModel } = $props();
</script>

<div class="content">
  {#each month.days as day (day)}
    <div class="cell day">{day}</div>
  {/each}
  {#each month.grid as date, idx (idx)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={['cell', 'date', date.isCurrent && 'current', date.isToday && 'today', date.isSelected && 'selected']}
      onclick={date.onSelect}
    >
      {date.day}
    </div>
  {/each}
</div>

<style lang="scss">
  .content {
    user-select: none;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
    > .cell {
      --size: 26px;
      &.day {
        font-size: var(--tiny-font-size-small);
        --width: var(--size);
        --height: min-content;
      }
      &.date {
        --width: var(--size);
        --height: var(--size);
        &:hover {
          --background: var(--tiny-selected-background-color-1);
          --color: var(--tiny-color);
        }
        &.today {
          --background: var(--tiny-selected-background-color-2);
          --color: var(--tiny-color);
        }
        &.selected {
          --background: var(--tiny-color);
          --color: var(--tiny-white-color);
        }

        font-size: var(--tiny-font-size-medium);
        border-radius: var(--size);
        background: var(--background);
        color: var(--color);
        &:not(.current) {
          opacity: 0.25;
        }
      }
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: var(--width);
      height: var(--height);
    }
  }
</style>
