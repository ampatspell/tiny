<script lang="ts">
  import { page } from '$app/state';
  import { getGalleryById } from '$lib/playground/galleries/galleries.remote.js';
  import { useGalleryProperties } from '$lib/playground/galleries/gallery.svelte.js';
  import Properties from '$lib/playground/galleries/properties.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import Section from '$lib/components/layout/editing/section.svelte';
  import Placeholder from '$lib/components/placeholder.svelte';
  import TablerPhoto from '$lib/playground/icons/tabler--photo.svelte';
  import { useEditingLayout } from '$lib/components/layout/editing/editing.svelte.js';
  import { resolve } from '$app/paths';

  usePropertiesContext();

  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let properties = useGalleryProperties({ isNew: false, data: getter(() => gallery) });

  let layout = useEditingLayout({
    title: getter(() => gallery.name),
    route: resolve('/galleries'),
    data: getter(() => gallery),
    properties,
  });
</script>

<Editing {layout}>
  <Section>
    <Properties {properties} />
  </Section>
  <Section title="Photographs" height="fill">
    <Placeholder icon={TablerPhoto} label="Section is coming" />
  </Section>
</Editing>
