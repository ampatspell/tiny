<script lang="ts" generics="I extends ItemData">
  import type { Snippet } from 'svelte';
  import type { ItemData } from './items.svelte';
  import BaseItem, { type ItemVariant } from '../content/item.svelte';
  import Icon from '../content/icon.svelte';
  import Label from '../content/label.svelte';

  let {
    item,
    isSelected = false,
    onSelect,
    variant,
    children,
  }: {
    item: I;
    isSelected?: boolean;
    onSelect: () => void;
    variant?: ItemVariant;
    children?: Snippet;
  } = $props();

  let state = $derived(item.state);
</script>

<BaseItem onClick={onSelect} {state} {isSelected} {variant}>
  <Icon icon={item.icon} />
  <Label label={item.label} />
  {@render children?.()}
</BaseItem>
