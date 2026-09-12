<script module lang="ts">
  import type { Component } from 'svelte';
  import Item from './item.svelte';
  import type { ItemState } from '../content/item.svelte';

  export type ItemData = {
    icon?: Component;
    label?: string;
    state?: ItemState;
  };
</script>

<script lang="ts" generics="I extends ItemData">
  let {
    items,
    selected,
    onSelect,
  }: {
    items: I[];
    selected: I | undefined;
    onSelect: (item: I | undefined) => void;
  } = $props();
</script>

{#each items as item (item)}
  <Item {item} onSelect={() => onSelect(item)} isSelected={item === selected} />
{/each}
