<script module lang="ts">
  import { createManyEntity } from '$lib/dynamic/dynamic.svelte.js';
  import TablerPhoto from '$lib/icons/tabler--photo.svelte';

  export const galleries = createManyEntity({
    id: 'galleries',
    name: 'Galleries',
    icon: TablerPhoto,
  });
</script>
