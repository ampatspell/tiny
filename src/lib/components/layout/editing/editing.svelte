<script lang="ts" generics="M extends Model, P extends Properties">
  import type { Snippet } from 'svelte';
  import Delete from './button/delete.svelte';
  import Save from './button/save.svelte';
  import Discard from './button/discard.svelte';
  import type { EditingLayout, Model, Properties } from './editing.svelte.ts';
  import Page from '$lib/components/page/page.svelte';

  let {
    layout,
    children,
  }: {
    layout: EditingLayout<M, P>;
    children: Snippet;
  } = $props();

  let label = $derived(layout.title);
</script>

<Page {label}>
  {#snippet accessories()}
    <Save {layout} />
    <Discard {layout} />
    <Delete {layout} />
  {/snippet}
  {@render children()}
</Page>
