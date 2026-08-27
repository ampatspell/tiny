<script lang="ts">
  import Tooltip from '$lib/tiny/floating/tooltip.svelte';
  import Icon from '$lib/tiny/icon.svelte';
  import type { Item } from './item.svelte.ts';

  let { item }: { item: Item } = $props();
  let isCurrent = $derived(item.isCurrent);
</script>

<a class={['item', isCurrent && 'current']} href={item.route}>
  <Tooltip label={item.name} offset={16} placement="right">
    <Icon icon={item.icon} />
  </Tooltip>
</a>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 5px;
    align-items: center;
    font-size: var(--tiny-font-size-small);
    text-decoration: none;
    &:hover {
      background: #222;
    }
    &.current {
      background: #111;
    }
  }
</style>
