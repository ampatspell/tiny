<script lang="ts">
  import type { Component } from 'svelte';
  import Button from '../button/button.svelte';
  import Icon from '../button/icon.svelte';
  import Dropdown from '../dropdown/basic/dropdown.svelte';
  import TablerChevronLeft from '../icons/tabler--chevron-left.svelte';
  import TablerChevronRight from '../icons/tabler--chevron-right.svelte';
  import type { MonthModel } from './models.svelte.ts';

  let { month }: { month: MonthModel } = $props();
</script>

{#snippet nav(icon: Component)}
  <div class="nav">
    <Button type="button" variant="light" onClick={() => {}}>
      <Icon {icon} />
    </Button>
  </div>
{/snippet}

<div class="header">
  {@render nav(TablerChevronLeft)}
  <div class="current">
    <Dropdown {...month.years} />
    <Dropdown {...month.months} />
  </div>
  {@render nav(TablerChevronRight)}
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
