<script lang="ts">
  import { page } from '$app/state';
  import List from '$lib/components/layout/list/list.svelte';
  import { getGalleries, type GalleryData } from '$lib/playground/galleries/galleries.remote.js';
  import type { Snippet } from 'svelte';
  import { useListLayout } from '$lib/components/layout/list/list.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import Label from '$lib/components/list/item/label.svelte';
  import Add from '$lib/playground/galleries/add.svelte';

  let { children }: { children?: Snippet } = $props();

  let id = $derived(page.params.id);
  let galleries = $derived(await getGalleries());

  let layout = useListLayout({
    selected: getter(() => id),
    models: getter(() => galleries),
    item,
    add,
  });
</script>

{#snippet item(gallery: GalleryData)}
  <Label
    label={gallery.name}
    description={{
      value: gallery.permalink,
      placeholder: 'No permalink',
    }}
  />
{/snippet}

{#snippet add(onDone: (id: string | undefined) => void)}
  <Add {onDone} />
{/snippet}

<List {layout}>
  {@render children?.()}
</List>
