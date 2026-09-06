<script lang="ts">
  import type { GalleryDetailsData } from '#lib/playground/galleries/galleries.remote.js';
  import Form from '#lib/tiny/form/form.svelte';
  import Json from '#lib/tiny/json.svelte';
  import { setGlobal } from '#lib/tiny/utils/set-global.js';
  import { withDataFields } from './index.svelte.ts';

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

  let fields = withDataFields({ data });
  let built = fields.create(({ string, array }) => {
    return {
      name: string('name'),
      files: array('files', ({ string }) => {
        return {
          fileId: string('fileId'),
        };
      }),
    };
  });

  built.record.name;
  built.record.files.definitions.record.fileId.key;

  let defined = fields.define(({ string, array }) => {
    let name = string('name');
    let permalink = string('permalink');
    let files = array('files', ({ string }) => {
      return {
        fileId: string('fileId'),
        galleryId: string('galleryId'),
      };
    });

    return {
      name,
      permalink,
      files,
    };
  });

  defined.record.name;
  defined.record.files.definitions.record.fileId.key;
  defined.record.files.definitions.build({ data: undefined as any }).record.fileId;

  setGlobal({ defined });
</script>

<Form>
  <Json data={defined} />
</Form>
