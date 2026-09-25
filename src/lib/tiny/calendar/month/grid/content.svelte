<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DateModel, MonthModel } from '../month.svelte.ts';

  let {
    month,
    children,
  }: {
    month: MonthModel;
    children: Snippet<[{ date: DateModel }]>;
  } = $props();
</script>

<div class="content">
  {#each month.grid as date (date.key)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={['cell', 'date', date.isCurrent && 'current', date.isToday && 'today', date.isSelected && 'selected']}
      onclick={date.onSelect}
    >
      <div class="header">
        <div class="day">
          {date.day}
        </div>
      </div>
      <div class="content">
        {@render children({ date })}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    user-select: none;
    > .cell {
      border: 1px solid var(--tiny-border-color-2);
      margin: 0 0 -1px -1px;
      display: flex;
      flex-direction: column;
      &.date {
        --padding: 5px;
        --background: var(--tiny-white-color);
        --color: var(--tiny-color);
        &.today {
          --background: var(--tiny-selected-background-color-2);
          --color: var(--tiny-color);
        }
        &.selected {
          --background: var(--tiny-color);
          --color: var(--tiny-white-color);
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
          overflow: hidden;
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
</style>
