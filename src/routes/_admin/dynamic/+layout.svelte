<script lang="ts">
  import { createManyEntity, createOneEntity, setDynamic } from '$lib/dynamic/dynamic.svelte.js';
  import Layout from '$lib/dynamic/layout.svelte';
  import TablerPhoto from '$lib/icons/tabler--photo.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import IndexContent from '$lib/playground/index-content.svelte';

  let { children } = $props();

  setDynamic({
    entities: [
      createOneEntity({
        id: 'index',
        name: 'Index',
        icon: TablerAppWindow,
        content: IndexContent,
      }),
      createManyEntity({
        id: 'galleries',
        name: 'Galleries',
        icon: TablerPhoto,
      }),
    ],
  });
</script>

<Layout>
  {@render children()}
</Layout>
