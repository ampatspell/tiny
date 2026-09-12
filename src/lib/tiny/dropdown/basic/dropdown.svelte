<script lang="ts" generics="T extends ItemData">
  import Item from './item.svelte';
  import type { ItemData } from './items.svelte';
  import { useFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { basic } from '#lib/tiny/floating/position.js';
  import Icon from '../content/icon.svelte';
  import TablerChevronUp from '#lib/tiny/icons/tabler--chevron-up.svelte';
  import TablerChevronDown from '#lib/tiny/icons/tabler--chevron-down.svelte';
  import Content from './content.svelte';

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

  let floaters = useFloaters();
  let reference = $state<HTMLDivElement>();
  let isOpen = $state(false);

  let onOpen = async () => {
    isOpen = true;
    try {
      await floaters.open({
        reference,
        position: basic(),
        request: null,
        snippet,
        close: null,
      }).response;
    } finally {
      isOpen = false;
    }
  };

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

{#snippet snippet({ close }: { close: () => void })}
  <Content {items} {selected} onSelect={onSelect(close)} />
{/snippet}

<div bind:this={reference}>
  <Item item={selected} onSelect={onOpen} variant="bordered">
    <Icon icon={isOpen ? TablerChevronUp : TablerChevronDown} />
  </Item>
</div>
