<script lang="ts">
  import { page } from '$app/state';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel } from '#lib/playground/galleries/gallery.svelte.js';
  import Fields from '#lib/playground/galleries/fields.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { useBackend } from '#lib/tiny/backend/context.svelte.js';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Placeholder from '#lib/tiny/placeholder.svelte';

  let backend = useBackend();
  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let model = useGalleryModel({ isNew: false, data: getter(() => gallery) });

  let layout = useEditingLayout({
    title: getter(() => gallery.name),
    model,
  });
</script>

<Editing {layout}>
  <Section>
    <Form size="regular">
      <Fields properties={model} />
    </Form>
  </Section>
  <Section title="Photographs" height="fill">
    <Placeholder icon={backend.item.icon} label="Section is coming" />
  </Section>
</Editing>
