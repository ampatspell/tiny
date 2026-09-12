<script lang="ts" generics="T extends ItemData">
  import Card from '#lib/tiny/card.svelte';
  import Items, { type ItemData } from './items.svelte';

  let {
    items,
    selected,
    onSelect,
  }: {
    items: T[];
    selected: T | undefined;
    onSelect: (choice: T | undefined) => void;
  } = $props();
</script>

<Card variant="smaller" width="fit">
  <Items {items} {selected} {onSelect} />
</Card>
