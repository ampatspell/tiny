<script lang="ts" generics="L extends ArrayGridEditingLayout">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Grid from '#lib/tiny/grid/grid.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import type { Snippet } from 'svelte';
  import Editing from '../editing/editing.svelte';
  import type { ArrayGridEditingLayout, InferItemFromLayout } from './layout.svelte.ts';
  import Selection from './selection.svelte';

  type I = InferItemFromLayout<L>;

  let {
    layout,
    general,
    item,
    selected: selectedSnippet,
  }: {
    layout: L;
    general: Snippet;
    item: Snippet<[{ item: I; isSelected: boolean }]>;
    selected: Snippet<[{ item: I }]>;
  } = $props();

  let field = $derived(layout.field);
  let items = $derived(field?.items);
  let selected = $derived(layout.selected);
  let onSelect = $derived(layout.onSelect);
</script>

<Editing layout={layout.editing}>
  <SplitView variant="wide">
    {#snippet sidebar()}
      <Section>
        <Form size="fill">
          <Content>
            {@render general()}
          </Content>
        </Form>
      </Section>
      <Selection {layout} selected={selectedSnippet} />
    {/snippet}
    <Section height="fill">
      {#if field && items}
        <Grid models={items} aspectRatio={layout.aspectRatio} {selected} {onSelect}>
          {#snippet children({ model, isSelected })}
            {@render item({ item: model as I, isSelected })}
          {/snippet}
        </Grid>
      {/if}
    </Section>
  </SplitView>
</Editing>
