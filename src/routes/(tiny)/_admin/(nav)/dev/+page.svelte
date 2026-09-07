<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import slug from 'slug';
  import Button from '#lib/tiny/button/button.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import { images } from '#lib/tiny/utils/utils.js';
  import { withDataFields } from '#lib/tiny/fields-2/index.svelte.js';
  import { notBlank } from '#lib/tiny/fields-2/validator.svelte.js';
  import Fields from '#lib/tiny/fields-2/form/fields.svelte';

  const data = {
    name: 'One',
    permalink: 'one',
    color: '#eee',
    position: 0,
    file: undefined,
    files: [
      {
        name: 'First',
      },
      {
        name: 'Second',
      },
    ],
  };

  const model = withDataFields({ data }).define(({ string, color, number, file, array }) => {
    return {
      name: string('name', {
        didUpdate: ({ after }) => {
          model.fields.permalink.update(slug(after, { replacement: '-' }));
        },
        validator: notBlank(),
      }),
      color: color('color'),
      file: file('file', { accept: images }),
      permalink: string('permalink'),
      position: number('position'),
      files: array('files', ({ string }) => {
        return {
          name: string('name'),
        };
      }),
    };
  });

  const fields = $derived(model.fields);

  const onSave = () => {
    if (model.touch()) {
      const dirty = model.serialized.dirty;
      if (dirty) {
        console.log('save', dirty);
      }
    }
  };
</script>

<Section title="Gallery">
  <Form size="wide">
    <Content>
      <Fields field={fields.name} />
      <Fields field={fields.color} />
      <Fields field={fields.permalink} />
      <Fields field={fields.file} />
      <Fields field={fields.position} />
    </Content>
  </Form>
</Section>

<Section title="Files">
  <Form size="wide">
    <Content>
      {#each fields.files.items as file (file)}
        <Fields field={file.record.name} />
      {/each}
      <Row>
        <Button label="Add" onClick={() => model.fields.files.add({ name: 'New' })} />
      </Row>
    </Content>
  </Form>
</Section>

<Section>
  <Form>
    <Content>
      <Row>
        <Button label="Save" onClick={onSave} isDisabled={!model.isDirty} />
        <Button label="Rollback" onClick={model.rollback} isDisabled={!model.isDirty} />
      </Row>
    </Content>
  </Form>
</Section>
