<script lang="ts">
  import type { GalleryDetailsData } from '#lib/playground/galleries/galleries.remote.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Input from '#lib/tiny/input.svelte';
  import Json from '#lib/tiny/json.svelte';
  import { Field } from './field.svelte.ts';
  import { withDataFields } from './index.svelte.ts';
  import { StringField } from './string.svelte.ts';

  const data: GalleryDetailsData = {
    id: 'gallery',
    name: 'One',
    permalink: 'one',
    files: [
      {
        id: 'file-1',
        name: 'file-1',
        position: 0,
        galleryId: 'gallery',
        fileId: 'file-1',
        file: { id: 'file-1', name: 'file-1.jpg', variants: [] },
      },
    ],
  };

  const fields = withDataFields({ data }).define(({ string, array }) => {
    return {
      name: string('name'),
      permalink: string('permalink'),
      files: array('files', ({ string }) => {
        return {
          name: string('name'),
        };
      }),
    };
  });
</script>

{#snippet string(field: StringField)}
  <Row>
    <Input value={field.value} onInput={field.onInput} />
  </Row>
  <Row>
    key: {field.key}, isDirty: {field.isDirty}, external: {field.external}, value: {field.value}
  </Row>
{/snippet}
<Form size="wide">
  <Content>
    {@render string(fields.record.name)}
    {@render string(fields.record.permalink)}
  </Content>
</Form>
