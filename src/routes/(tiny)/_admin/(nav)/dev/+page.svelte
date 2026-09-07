<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
  import { useFiles, type UniversalFile } from '#lib/tiny/files.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Json from '#lib/tiny/json.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { setGlobal } from '#lib/tiny/utils/set-global.js';
  import { images } from '#lib/tiny/utils/utils.js';

  let files = useFiles();

  let data = $state<{
    items: {
      id?: string;
      file: UniversalFile | undefined;
      name: string;
    }[];
  }>({ items: [] });

  let model = withDataFields({ data: getter(() => data) }).define(({ array }) => {
    return {
      files: array('items', ({ string, file }) => {
        return {
          file: file('file', { accept: images }),
          name: string('name'),
        };
      }),
    };
  });

  let onAdd = async () => {
    let file = await files.pick.file({ accept: images });
    if (file) {
      model.record.files.add({
        id: undefined,
        name: file.name,
        file,
      });
    }
  };

  let onRollback = () => {
    model.rollback();
  };

  setGlobal({ files: model.record.files });

  let onPick = async () => {
    let picked = await files.pick.files({ accept: images });
    if (picked.status === 'picked') {
      let field = model.record.files;
      field.clear();
      picked.models.forEach((file) =>
        field.add({
          file,
          name: file.name,
        }),
      );
    }
  };

  let onSave = () => {
    if (model.touch()) {
      console.log(model.serialized.dirty);
    }
  };
</script>

<Section>
  <Form size="wide">
    <Content>
      <Button label="Pick" onClick={onPick} />
    </Content>
  </Form>
</Section>

{#each model.record.files.items as item (item)}
  <Section>
    <Form size="wide">
      <Content>
        <Fields field={item.record.file} />
        <Fields field={item.record.name} />
        <Row>
          {#if item.isDeleted}
            <Button label="Restore" onClick={() => item.restore()} />
          {:else}
            <Button label="Delete" onClick={() => item.delete()} />
          {/if}
        </Row>
      </Content>
    </Form>
  </Section>
{/each}

<Section>
  <Form size="wide">
    <Content>
      <Row>
        <Button label="Add" onClick={onAdd} />
        <Button label="Save" onClick={onSave} />
        <Button label="Rollback" onClick={onRollback} />
      </Row>
      <Row>isDirty: {model.isDirty}</Row>
    </Content>
  </Form>
</Section>

<Section>
  <Form size="wide">
    <Content>
      <Row><Json data={model.serialized.all} /></Row>
    </Content>
  </Form>
</Section>
