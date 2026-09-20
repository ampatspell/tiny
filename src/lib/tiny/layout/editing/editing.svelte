<script lang="ts" generics=" P extends Model">
  import Page from '#lib/tiny/page/page.svelte';
  import { useNavigationConfirmation } from '#lib/tiny/utils/navigation.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import type { Snippet } from 'svelte';
  import Delete from './button/delete.svelte';
  import Discard from './button/discard.svelte';
  import Public from './button/public.svelte';
  import Save from './button/save.svelte';
  import { type EditingLayout, type Model } from './layout.svelte.ts';

  let {
    layout,
    children,
  }: {
    layout: EditingLayout<P>;
    children?: Snippet;
  } = $props();

  let label = $derived(layout.title);

  useNavigationConfirmation({
    isDirty: getter(() => layout.isDirty),
    isDestroyed: getter(() => layout.isDestroyed),
  });

  let isBusy = $derived(layout.isSaving);
</script>

<Page {label} {isBusy}>
  {#snippet navigation()}
    <Public {layout} />
  {/snippet}
  {#snippet accessories()}
    <Save {layout} />
    <Discard {layout} />
    <Delete {layout} />
  {/snippet}
  {@render children?.()}
</Page>
