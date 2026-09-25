<script lang="ts">
  import { getter } from '../utils/options.svelte.ts';
  import { useMonth } from './models.svelte.ts';

  let {
    date: _date,
    onUpdate,
  }: {
    date: Temporal.PlainDate | undefined;
    onUpdate: (date: Temporal.PlainDate) => void;
  } = $props();

  let model = useMonth({
    date: getter(() => _date),
    onUpdate: getter(() => onUpdate),
  });
</script>

<div class="month">
  {#each model.days as day (day)}
    <div class="cell day">{day}</div>
  {/each}
  {#each model.grid as day (day.key)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class={['cell', 'date', day.isToday && 'today', day.isSelected && 'selected']} onclick={day.onSelect}>
      {day.day}
    </div>
  {/each}
</div>

<style lang="scss">
  .month {
    padding: 5px;
    user-select: none;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
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
