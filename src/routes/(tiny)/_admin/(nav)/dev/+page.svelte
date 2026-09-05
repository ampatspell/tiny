<script lang="ts">
  import type { GalleryDetailsData } from '#lib/playground/galleries/galleries.remote.js';
  import { withDataFields } from './models.svelte.ts';

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
  let defined = fields.define(({ string, array }) => {
    let name = string('name');
    let permalink = string('permalink');
    let files = array('files', ({ string }) => {
      return {
        name: string('name'),
      };
    });
    return {
      name,
      permalink,
      files,
    };
  });
</script>
