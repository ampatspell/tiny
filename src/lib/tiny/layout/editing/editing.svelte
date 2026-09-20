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
  let save = $state<Save<P>>();

  useNavigationConfirmation({
    isDirty: getter(() => layout.isDirty),
    isDestroyed: getter(() => layout.isDestroyed),
  });

  let isBusy = $derived(save?.isBusy ?? false);
</script>

<Page {label} {isBusy}>
  {#snippet navigation()}
    <Public {layout} />
  {/snippet}
  {#snippet accessories()}
    <!-- remove bind. save in layout should have isBusy, not this madness-->
    <Save bind:this={save} {layout} />
    <Discard {layout} />
    <Delete {layout} />
  {/snippet}
  {@render children?.()}
</Page>
