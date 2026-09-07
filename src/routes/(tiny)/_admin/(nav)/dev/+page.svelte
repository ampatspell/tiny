<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Json from '#lib/tiny/json.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import { setGlobal } from '#lib/tiny/utils/set-global.js';

  let data: { files: { id?: string; name: string }[] } = {
    files: [
      { id: 'one', name: 'one!' },
      { id: 'two', name: 'two!' },
    ],
  };

  let model = withDataFields({ data }).define(({ array }) => {
    return {
      files: array('files', ({ string }) => {
        return {
          name: string('name'),
        };
      }),
    };
  });

  let onAdd = () => {
    model.record.files.add({ id: undefined, name: 'New' });
  };

  let onRollback = () => {
    model.rollback();
  };

  setGlobal({ files: model.record.files });
</script>

{#each model.record.files.items as item (item)}
  <Section>
    <Form size="wide">
      <Content>
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
