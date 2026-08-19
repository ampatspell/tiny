<script lang="ts">
  import { resolve } from '$app/paths';
  import { setBackend } from '$lib/components/backend/backend.svelte.js';
  import Backend from '$lib/components/layout/backend/backend.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
  import TablerPhoto from '$lib/playground/icons/tabler--photo.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  setBackend({
    sections: [
      {
        name: 'Home',
        icon: LucideCat,
        route: resolve('/'),
      },
      {
        name: 'Index',
        icon: TablerAppWindow,
        route: resolve('/index'),
      },
      {
        name: 'Galleries',
        icon: TablerPhoto,
        route: resolve('/galleries'),
        select: (id) => resolve('/galleries/[id]', { id }),
      },

      {
        name: 'Dev',
        icon: TablerCode,
        route: resolve('/dev'),
      },
    ],
  });
</script>

<svelte:head>
  <title>Tiny</title>
</svelte:head>

<Backend>
  {@render children()}
</Backend>
