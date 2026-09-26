<script lang="ts" generics="T extends ItemData">
  import Item from './item.svelte';
  import type { ItemData } from './items.svelte';
  import Content from './content.svelte';
  import Chevron from '../content/chevron.svelte';
  import Clickable from '../content/clickable.svelte';

  let {
    items: _items,
    selected: _selected,
    onSelect: _onSelect,
    isRequired = false,
  }: {
    items: T[];
    selected: T | undefined;
    onSelect: (choice: T | undefined) => void;
    isRequired?: boolean;
  } = $props();

  let blank = {} as T;
  let selected = $derived(_selected ?? blank);

  let items = $derived.by<T[]>(() => {
    if (!isRequired) {
      return [blank, ..._items];
    }
    return _items;
  });

  let onSelect = (close: () => void) => (item: T | undefined) => {
    _onSelect(item === blank ? undefined : item);
    close();
  };
</script>

<Clickable>
  {#snippet content({ close })}
    <Content {items} {selected} onSelect={onSelect(close)} />
  {/snippet}
  {#snippet children({ isOpen, open })}
    <Item item={selected} onSelect={open} variant="bordered">
      <Chevron {isOpen} />
    </Item>
  {/snippet}
</Clickable>
