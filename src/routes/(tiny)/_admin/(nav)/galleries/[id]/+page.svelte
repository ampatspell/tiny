<script lang="ts">
  import Fields from '#lib/playground/galleries/fields.svelte';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel, type GalleryFileArrayFieldItem } from '#lib/playground/galleries/gallery.svelte.js';
  import Button from '#lib/tiny/button/button.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import FormFields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import File from '#lib/tiny/grid/file.svelte';
  import Grid from '#lib/tiny/grid/grid.svelte';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let model = useGalleryModel({ isNew: false, data: getter(() => gallery) });
  let onAdd = () => model.add();
  let onClear = () => model.clear();
  let _selected = $derived(model.fields.files?.items[0]);
  let selected = $derived.by(() => {
    if (!_selected?.isDeleted) {
      return _selected;
    }
  });
  let onSelect = (next: GalleryFileArrayFieldItem | undefined) => {
    _selected = next;
  };

  let layout = useEditingLayout({
    title: getter(() => gallery.name),
    model,
  });
</script>

<Editing {layout}>
  <Section>
    <Form size="regular">
      <Content>
        <Fields {model} />
      </Content>
    </Form>
  </Section>
  {#if model.fields.files}
    <Section height="fill">
      <SplitView variant="reversed">
        <Grid models={model.fields.files.items.filter((item) => !item.isDeleted)} {selected} {onSelect}>
          {#snippet children({ model, isSelected })}
            <File file={model.record.file.value} {isSelected} />
          {/snippet}
        </Grid>
        <Form>
          <Content>
            <Row>
              <Button label="Add" onClick={onAdd} />
              <Button label="Clear" onClick={onClear} />
            </Row>
          </Content>
        </Form>
        {#snippet sidebar()}
          {#if selected}
            <Form size="max">
              <Content>
                <FormFields field={selected.record.file} />
                <FormFields field={selected.record.name} />
                <FormFields field={selected.record.position} />
                <Row>
                  <Button label="Remove" onClick={() => selected?.delete()} />
                </Row>
              </Content>
            </Form>
          {/if}
        {/snippet}
      </SplitView>
    </Section>
  {/if}
</Editing>
