<script lang="ts" generics="M extends Model">
  import Item from '$lib/components/list/item/item.svelte';
  import { type ListLayout, type Model } from './list.svelte.ts';

  let {
    layout,
    model,
  }: {
    layout: ListLayout<M>;
    model: M;
  } = $props();

  let item = $derived(layout.item);
  let selected = $derived(layout.selected);
</script>

<Item route={layout.select(model.id)} isCurrent={model.id === selected}>
  {@render item(model)}
</Item>
