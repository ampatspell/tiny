<script lang="ts">
  import Fields from '#lib/playground/galleries/fields.svelte';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel } from '#lib/playground/galleries/gallery.svelte.js';
  import Button from '#lib/tiny/button/button.svelte';
  import Field from '#lib/tiny/fields/field.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

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
      <Fields {model} />
    </Form>
  </Section>
  {#if model.fields.files}
    <Section title="Photographs" height="fill">
      {#each model.fields.files.items as file (file)}
        {#if !file.isDeleted}
          <Form size="regular">
            <Field field={file.record.file} />
            <Field field={file.record.name} />
            <Actions>
              <Button label="Remove" onClick={() => file.delete()} />
            </Actions>
          </Form>
        {/if}
      {/each}
    </Section>
  {/if}
</Editing>
