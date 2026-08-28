<script lang="ts" generics="M extends Model">
  import type { Snippet } from 'svelte';
  import type { ListLayout, Model } from './layout.svelte.ts';
  import List from '../../list/list.svelte';
  import Header from './header.svelte';
  import Item from './item.svelte';
  import SplitView from '$lib/tiny/split-view.svelte';

  let {
    layout,
    children,
  }: {
    layout: ListLayout<M>;
    children: Snippet;
  } = $props();

  let route = $derived(layout.index);
  let models = $derived(layout.models);
</script>

<SplitView>
  {#snippet sidebar()}
    <List {route}>
      {#snippet header()}
        <Header {layout} />
      {/snippet}
      {#each models as model (model.id)}
        <Item {layout} {model} />
      {/each}
    </List>
  {/snippet}
  {@render children()}
</SplitView>
