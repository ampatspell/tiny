<script lang="ts">
  import Fields from '#lib/playground/galleries/fields.svelte';
  import { getGalleryById } from '#lib/playground/galleries/galleries.remote.js';
  import { useGalleryModel, type GalleryFileArrayFieldItem } from '#lib/playground/galleries/gallery.svelte.js';
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Label from '#lib/tiny/button/label.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import FormFields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import File from '#lib/tiny/grid/file.svelte';
  import Grid from '#lib/tiny/grid/grid.svelte';
  import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
  import TablerSquareRoundedPlus from '#lib/tiny/icons/tabler--square-rounded-plus.svelte';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import Placeholder from '#lib/tiny/placeholder.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
  let model = useGalleryModel({ isNew: false, data: getter(() => gallery) });
  let onAdd = () => model.add();
  let onClear = () => model.fields.files?.clear();
  let onRestore = () => model.fields.files?.restore();
  let _selected = $state<GalleryFileArrayFieldItem>();
  let selected = $derived.by(() => {
    if (_selected && model.fields.files?.items.includes(_selected)) {
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
  <SplitView variant="wide">
    {#snippet sidebar()}
      <Section>
        <Form size="regular">
          <Content>
            <Fields {model} />
          </Content>
        </Form>
      </Section>
      <Section height="fill">
        {#if selected}
          <Form size="max">
            <Content>
              <FormFields field={selected.record.file} />
              <FormFields field={selected.record.name} />
              <FormFields field={selected.record.position} />
              <Row>
                {#if selected.isDeleted}
                  <Button variant="light" label="Restore" onClick={() => selected?.restore()} />
                {:else}
                  <Button variant="light" label="Delete" onClick={() => selected?.delete()} />
                {/if}
              </Row>
            </Content>
          </Form>
        {:else}
          <Placeholder icon={TablerPhoto} label="No selection" />
        {/if}
      </Section>
      {@const files = model.fields.files}
      {#if files}
        <Section>
          <Form>
            <Content>
              <Row>
                <Button onClick={onAdd}>
                  <Icon icon={TablerSquareRoundedPlus} />
                  <Label>Add files</Label>
                </Button>
                {#if files.items.length}
                  {#if files.existing.length}
                    <Button variant="light" label="Delete all" onClick={onClear} />
                  {:else}
                    <Button variant="light" label="Restore" onClick={onRestore} />
                  {/if}
                {/if}
              </Row>
            </Content>
          </Form>
        </Section>
      {/if}
    {/snippet}
    <Section height="fill">
      {#if model.fields.files}
        <Grid models={model.fields.files.items} aspectRatio="2x3" {selected} {onSelect}>
          {#snippet children({ model, isSelected })}
            <File file={model.record.file.value} {isSelected} isDeleted={model.isDeleted} />
          {/snippet}
        </Grid>
      {/if}
    </Section>
  </SplitView>
</Editing>
