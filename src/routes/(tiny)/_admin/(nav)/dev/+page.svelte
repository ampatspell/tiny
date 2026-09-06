<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import slug from 'slug';
  import { withDataFields } from './index.svelte.ts';
  import Input from './input.svelte';
  import { notBlank } from './validator.svelte.ts';
  import Button from '#lib/tiny/button/button.svelte';

  const data = {
    name: 'One',
    permalink: 'one',
    files: [
      {
        name: 'First',
      },
      {
        name: 'Second',
      },
    ],
  };

  const fields = withDataFields({ data }).define(({ string, array }) => {
    return {
      name: string('name', {
        didUpdate: ({ after }) => {
          fields.record.permalink.update(slug(after, { replacement: '-' }));
        },
        validator: notBlank(),
      }),
      permalink: string('permalink'),
      files: array('files', ({ string }) => {
        return {
          name: string('name'),
        };
      }),
    };
  });
</script>

<Form size="wide">
  <Content>
    <Row>
      <Input field={fields.record.name} />
    </Row>
    <Row>
      <Input field={fields.record.permalink} />
    </Row>
    <Row>
      <Button label="Save" onClick={fields.touch} />
      <Button label="Rollback" onClick={fields.rollback} />
    </Row>
  </Content>
</Form>
