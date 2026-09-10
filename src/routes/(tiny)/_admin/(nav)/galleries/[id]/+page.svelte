<script lang="ts">
  import BaseFields from '#lib/playground/galleries/fields.svelte';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel } from '#lib/playground/galleries/gallery.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import File from '#lib/tiny/grid/file.svelte';
  import FilesGrid from '#lib/tiny/layout/array-grid/array-grid.svelte';
  import { useArrayGridEditingLayout } from '#lib/tiny/layout/array-grid/layout.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let model = useGalleryModel({ isNew: false, data: getter(() => gallery) });
  let layout = useArrayGridEditingLayout({
    model,
    field: getter(() => model.fields.files),
    onAdd: () => model.add(),
    aspectRatio: '3x2',
  });
</script>

<FilesGrid {layout}>
  {#snippet general()}
    <Section>
      <Form size="fill">
        <Content>
          <BaseFields {model} />
        </Content>
      </Form>
    </Section>
  {/snippet}

  {#snippet item({ item, isSelected })}
    <File file={item.record.file.value} {isSelected} isDeleted={item.isDeleted} />
  {/snippet}

  {#snippet selected({ item, deleteRestoreRow })}
    <Form size="fill">
      <Content>
        <Fields field={item.record.file} />
        <Fields field={item.record.name} />
        {@render deleteRestoreRow()}
      </Content>
    </Form>
  {/snippet}
</FilesGrid>
