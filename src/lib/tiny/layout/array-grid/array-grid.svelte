<script lang="ts" generics="T extends GridModel, F extends ArrayField, I extends InferArrayFieldItem<F>">
  import type { ArrayField } from '#lib/tiny/fields/fields/array.svelte.js';
  import type { InferArrayFieldItem } from '#lib/tiny/fields/models/types.svelte.js';
  import Grid from '#lib/tiny/grid/grid.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import type { Snippet } from 'svelte';
  import Editing from '../editing/editing.svelte';
  import type { ArrayGridEditingLayout, GridModel } from './layout.svelte.ts';
  import Selection from './selection.svelte';

  let {
    layout,
    general,
    item,
    selected: selectedSnippet,
  }: {
    layout: ArrayGridEditingLayout<T, F>;
    general: Snippet;
    item: Snippet<[{ item: I; isSelected: boolean }]>;
    selected: Snippet<[{ item: I; deleteRestoreRow: Snippet }]>;
  } = $props();

  let field = $derived(layout.field);
  let items = $derived(field?.items as I[]);
  let selected = $derived(layout.selected);
  let onSelect = $derived(layout.onSelect);
</script>

<Editing layout={layout.editing}>
  <SplitView variant="wide">
    {#snippet sidebar()}
      {@render general()}
      <Selection {layout} selected={selectedSnippet} />
    {/snippet}
    <Section height="fill">
      {#if field}
        <Grid models={items} aspectRatio="2x3" {selected} {onSelect}>
          {#snippet children({ model, isSelected })}
            {@render item({ item: model as I, isSelected })}
          {/snippet}
        </Grid>
      {/if}
    </Section>
  </SplitView>
</Editing>
