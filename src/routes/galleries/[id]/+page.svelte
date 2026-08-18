<script lang="ts">
  import { page } from '$app/state';
  import { getGalleryById } from '$lib/playground/galleries/galleries.remote.js';
  import { useGalleryProperties } from '$lib/playground/galleries/gallery.svelte.js';
  import Properties from '$lib/playground/galleries/properties.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { confirm } from '$lib/components/floating/layout/confirmation.svelte';

  let id = $derived(page.params.id!);
  let floaters = useFloaters();
  usePropertiesContext();
  let gallery = $derived(await getGalleryById({ id }));
  let properties = useGalleryProperties({ isNew: false, data: getter(() => gallery) });

  let onDelete = async (reference: HTMLElement) => {
    if (
      await confirm({
        floaters,
        reference,
        title: 'Delete?',
        description: 'Sure you want to delete this gallery?',
        confirm: 'Delete',
      })
    ) {
      await properties.destroy();
      goto(resolve('/galleries'), { replaceState: true });
    }
  };
</script>

<Editing label={gallery.name} {properties} {onDelete}>
  <Properties {properties} />
</Editing>
