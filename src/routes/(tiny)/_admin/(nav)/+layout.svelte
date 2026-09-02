<script lang="ts">
  import { resolve } from '$app/paths';
  import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
  import LucideCat from '#lib/tiny/icons/lucide--cat.svelte';
  import TablerAppWindow from '#lib/playground/icons/tabler--app-window.svelte';
  import TablerCode from '#lib/playground/icons/tabler--code.svelte';
  import type { Snippet } from 'svelte';
  import { setBackend } from '#lib/tiny/backend/context.svelte.js';
  import Floaters from '#lib/tiny/floating/floaters/floaters.svelte';
  import Backend from '#lib/tiny/backend/backend.svelte';
  import { setFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { equals } from '#lib/tiny/backend/navigation/model.svelte.js';
  import TablerBalloon from '#lib/tiny/icons/tabler--balloon.svelte';

  let { children }: { children: Snippet } = $props();

  setBackend({
    items: [
      {
        name: 'Public',
        icon: TablerBalloon,
        route: resolve('/'),
        cmp: equals,
      },
      {
        name: 'Cat',
        icon: LucideCat,
        route: resolve('/(tiny)/_admin/(nav)'),
        cmp: equals,
      },
      {
        name: 'Index',
        icon: TablerAppWindow,
        route: resolve('/(tiny)/_admin/(nav)/index'),
      },
      {
        name: 'Galleries',
        icon: TablerPhoto,
        route: resolve('/(tiny)/_admin/(nav)/galleries'),
        select: (id) => resolve('/(tiny)/_admin/(nav)/galleries/[id]', { id }),
      },
      {
        name: 'In development',
        icon: TablerCode,
        route: resolve('/(tiny)/_admin/(nav)/dev'),
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
