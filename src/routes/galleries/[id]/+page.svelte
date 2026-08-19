<script lang="ts">
  import { page } from '$app/state';
  import { getGalleryById } from '$lib/playground/galleries/galleries.remote.js';
  import { useGalleryProperties } from '$lib/playground/galleries/gallery.svelte.js';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import Section from '$lib/components/layout/editing/section.svelte';
  import Placeholder from '$lib/components/placeholder.svelte';
  import { useEditingLayout } from '$lib/components/layout/editing/editing.svelte.js';
  import Form from '$lib/components/form/form.svelte';
  import Properties from '$lib/playground/galleries/properties.svelte';
  import { useBackend } from '$lib/components/backend/backend.svelte.js';

  let backend = useBackend();
  usePropertiesContext();
  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let properties = useGalleryProperties({ isNew: false, data: getter(() => gallery) });

  let layout = useEditingLayout({
    title: getter(() => gallery.name),
    data: getter(() => gallery),
    properties,
  });
</script>

<Editing {layout}>
  <Section>
    <Form size="regular">
      <Properties {properties} />
    </Form>
  </Section>
  <Section title="Photographs" height="fill">
    <Placeholder icon={backend.section.icon} label="Section is coming" />
  </Section>
</Editing>
