<script lang="ts">
  import { resolve } from '$app/paths';
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
  import type { Snippet } from 'svelte';
  import { setBackend } from '$lib/tiny/backend/backend.svelte.js';
  import Backend from '$lib/tiny/layout/backend/backend.svelte';

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
        name: 'In development',
        icon: TablerCode,
        route: resolve('/_admin/dev'),
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
