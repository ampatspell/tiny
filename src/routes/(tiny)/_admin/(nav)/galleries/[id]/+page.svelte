<script lang="ts">
  import { page } from '$app/state';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel } from '#lib/playground/galleries/gallery.svelte.js';
  import Fields from '#lib/playground/galleries/fields.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Json from '#lib/tiny/json.svelte';

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
    <Form>
      <Json data={gallery.files} />
    </Form>
  </Section>
</Editing>
