<script module lang="ts">
  import { createOneEntity } from '$lib/dynamic/dynamic.svelte.js';
  import TablerAppWindow from './icons/tabler--app-window.svelte';

  export const index = createOneEntity({
    id: 'index',
    name: 'Index',
    icon: TablerAppWindow,
  });
</script>
