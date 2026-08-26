<script lang="ts">
  import { resolve } from '$app/paths';
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
  import type { Snippet } from 'svelte';
  import { setBackend } from '$lib/tiny/backend/backend.svelte.js';
  import Floaters from '$lib/tiny/floating/floaters.svelte';
  import { setFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import Backend from '$lib/tiny/backend/backend.svelte';

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
        route: resolve('/_admin/(content)/index'),
      },
      {
        name: 'Galleries',
        icon: TablerPhoto,
        route: resolve('/_admin/(content)/galleries'),
        select: (id) => resolve('/_admin/(content)/galleries/[id]', { id }),
      },
      {
        name: 'In development',
        icon: TablerCode,
        route: resolve('/_admin/(content)/dev'),
      },
    ],
  });

  setFloaters();
</script>

<svelte:head>
  <title>Tiny backend</title>
</svelte:head>

<Backend>
  {@render children()}
</Backend>

<Floaters />
