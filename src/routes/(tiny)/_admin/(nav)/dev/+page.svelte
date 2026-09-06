<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import slug from 'slug';
  import { withDataFields } from './index.svelte.ts';
  import Input from './input.svelte';
  import { notBlank } from './validator.svelte.ts';
  import Button from '#lib/tiny/button/button.svelte';
  import Section from '#lib/tiny/page/section.svelte';

  const data = {
    name: 'One',
    permalink: 'one',
    position: 0,
    files: [
      {
        name: 'First',
      },
      {
        name: 'Second',
      },
    ],
  };

  const model = withDataFields({ data }).define(({ string, number, array }) => {
    return {
      name: string('name', {
        didUpdate: ({ after }) => {
          model.record.permalink.update(slug(after, { replacement: '-' }));
        },
        validator: notBlank(),
      }),
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
</script>

<Section title="Gallery">
  <Form size="wide">
    <Content>
      <Row>
        <Input field={fields.name} />
      </Row>
      <Row>
        <Input field={fields.permalink} />
      </Row>
      <Row>
        <Input field={fields.position} />
      </Row>
    </Content>
  </Form>
</Section>

<Section title="Files">
  <Form size="wide">
    <Content>
      {#each fields.files.items as file (file)}
        <Row>
          <Input field={file.record.name} />
        </Row>
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
        <Button label="Save" onClick={model.touch} />
        <Button label="Rollback" onClick={model.rollback} />
      </Row>
    </Content>
  </Form>
</Section>
