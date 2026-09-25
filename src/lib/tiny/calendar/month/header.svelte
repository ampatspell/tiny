<script lang="ts">
  import type { Component } from 'svelte';
  import type { MonthModel } from './models.svelte.ts';
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import TablerChevronLeft from '#lib/tiny/icons/tabler--chevron-left.svelte';
  import TablerChevronRight from '#lib/tiny/icons/tabler--chevron-right.svelte';
  import Dropdown from '#lib/tiny/dropdown/basic/dropdown.svelte';

  let { month }: { month: MonthModel } = $props();
</script>

{#snippet nav(icon: Component, onClick: () => void)}
  <div class="nav">
    <Button type="button" variant="light" {onClick}>
      <Icon {icon} />
    </Button>
  </div>
{/snippet}

<div class="header">
  {@render nav(TablerChevronLeft, month.months.prev)}
  <div class="current">
    <Dropdown {...month.years} />
    <Dropdown {...month.months} />
  </div>
  {@render nav(TablerChevronRight, month.months.next)}
</div>

<style lang="scss">
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    > .current {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
  }
</style>
