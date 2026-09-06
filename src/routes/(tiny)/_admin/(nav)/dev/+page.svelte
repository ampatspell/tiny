<script lang="ts">
  import type { GalleryDetailsData } from '#lib/playground/galleries/galleries.remote.js';
  import Button from '#lib/tiny/button/button.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Input from '#lib/tiny/input.svelte';
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
      {
        id: 'file-2',
        name: 'file-2',
        position: 0,
        galleryId: 'gallery',
        fileId: 'file-2',
        file: { id: 'file-2', name: 'file-2.jpg', variants: [] },
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

  const blank = {
    name: 'new',
    file: undefined,
    fileId: '',
    galleryId: '',
    id: '',
    position: 0,
  };
</script>

{#snippet string(field: StringField)}
  <Row>
    <Input value={field.value} onInput={field.onInput} />
  </Row>
{/snippet}
<Form size="wide">
  <Content>
    {@render string(fields.record.name)}
    {@render string(fields.record.permalink)}

    {#each fields.record.files.items as item (item)}
      {@render string(item.record.name)}
    {/each}

    <Button label="Add new file" onClick={() => fields.record.files.add(blank)} />
  </Content>
</Form>
