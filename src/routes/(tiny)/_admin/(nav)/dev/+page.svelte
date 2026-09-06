<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import slug from 'slug';
  import { withDataFields } from './index.svelte.ts';
  import { notBlank } from './validator.svelte.ts';
  import Button from '#lib/tiny/button/button.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import { images } from '#lib/tiny/utils/utils.js';
  import Fields from './fields.svelte';

  const data = {
    name: 'One',
    permalink: 'one',
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

  const model = withDataFields({ data }).define(({ string, number, file, array }) => {
    return {
      name: string('name', {
        didUpdate: ({ after }) => {
          model.record.permalink.update(slug(after, { replacement: '-' }));
        },
        validator: notBlank(),
      }),
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

  const fields = $derived(model.record);

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
        <Button label="Add" onClick={() => model.record.files.add({ name: 'New' })} />
      </Row>
    </Content>
  </Form>
</Section>

<Section>
  <Form>
    <Content>
      <Row>
        <Button label="Save" onClick={onSave} />
        <Button label="Rollback" onClick={model.rollback} />
      </Row>
    </Content>
  </Form>
</Section>
