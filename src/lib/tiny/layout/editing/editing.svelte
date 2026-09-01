<script lang="ts" generics=" P extends Model">
  import type { Snippet } from 'svelte';
  import Delete from './button/delete.svelte';
  import Save from './button/save.svelte';
  import Discard from './button/discard.svelte';
  import Page from '#lib/tiny/page/page.svelte';
  import type { EditingLayout, Model } from './layout.svelte.ts';

  let {
    layout,
    children,
  }: {
    layout: EditingLayout<P>;
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
