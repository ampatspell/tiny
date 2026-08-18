<script module lang="ts">
  export type NavigationItem = {
    icon: Component;
    tooltip: string;
    route: ResolvedPathname;
  };

  export type NavigationItems = NavigationItem[];

  export type NavigationProps = {
    items: NavigationItems;
  };
</script>

<script lang="ts">
  import type { ResolvedPathname } from '$app/types';
  import type { Component } from 'svelte';
  import Icon from '../icon.svelte';
  import Tooltip from '../floating/tooltip.svelte';
  import { page } from '$app/state';

  let { items }: NavigationProps = $props();
  let route = $derived(page.url.pathname);

  let eq = ['/'];
  const isCurrent = (item: NavigationItem) => {
    if (eq.includes(item.route)) {
      return item.route === route;
    } else {
      return route.startsWith(item.route);
    }
  };
</script>

<div class="navigation">
  <div class="items">
    {#each items as item (item.icon)}
      <a class={['item', isCurrent(item) && 'current']} href={item.route}>
        <Tooltip label={item.tooltip} offset={14} placement="right">
          <Icon icon={item.icon} />
        </Tooltip>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  .navigation {
    flex: 1;
    width: min-content;
    background: #333;
    color: #fff;
    display: flex;
    flex-direction: column;
    > .items {
      display: flex;
      flex-direction: column;
      > .item {
        display: flex;
        flex-direction: row;
        padding: 10px;
        gap: 5px;
        align-items: center;
        font-size: var(--dark-font-size-small);
        text-decoration: none;
        &:hover {
          background: #222;
        }
        &.current {
          background: #111;
        }
      }
    }
  }
</style>
