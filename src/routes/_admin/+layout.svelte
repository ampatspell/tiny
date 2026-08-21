<script lang="ts">
  import { resolve } from '$app/paths';
  import { setBackend } from '$lib/components/backend/backend.svelte.js';
  import Backend from '$lib/components/layout/backend/backend.svelte';
  import TablerPhoto from '$lib/icons/tabler--photo.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  setBackend({
    sections: [
      {
        name: 'Public',
        icon: LucideCat,
        route: resolve('/'),
      },
      {
        name: 'Index',
        icon: TablerAppWindow,
        route: resolve('/_admin/index'),
      },
      {
        name: 'Galleries',
        icon: TablerPhoto,
        route: resolve('/_admin/galleries'),
        select: (id) => resolve('/_admin/galleries/[id]', { id }),
      },
      {
        name: 'Dynamic',
        icon: TablerCode,
        route: resolve('/_admin/dynamic'),
      },
    ],
  });
</script>

<svelte:head>
  <title>Tiny backend</title>
</svelte:head>

<Backend>
  {@render children()}
</Backend>
