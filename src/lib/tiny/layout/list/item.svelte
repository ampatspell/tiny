<script lang="ts" generics="M extends Model">
  import { type ListLayout, type Model } from './layout.svelte.ts';
  import Item from '$lib/tiny/list/item/item.svelte';

  let {
    layout,
    model,
  }: {
    layout: ListLayout<M>;
    model: M;
  } = $props();

  let item = $derived(layout.item);
  let selected = $derived(layout.selected);
  let route = $derived.by(() => {
    if (layout.select) {
      return layout.select(model.id);
    }
  });
  let isCurrent = $derived(model.id === selected);
</script>

<Item {route} {isCurrent}>
  {@render item(model)}
</Item>
