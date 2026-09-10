<script lang="ts">
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel } from '#lib/playground/galleries/gallery.svelte.js';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import File from '#lib/tiny/grid/file.svelte';
  import FilesGrid from '#lib/tiny/layout/array-grid/array-grid.svelte';
  import { useArrayGridEditingLayout } from '#lib/tiny/layout/array-grid/layout.svelte.js';
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
    <Fields field={model.fields.name} />
    <Fields field={model.fields.permalink} />
  {/snippet}

  {#snippet item({ item, isSelected })}
    <File file={item.record.file.value} {isSelected} isDeleted={item.isDeleted} />
  {/snippet}

  {#snippet selected({ item })}
    <Fields field={item.record.file} />
    <Fields field={item.record.name} />
  {/snippet}
</FilesGrid>
