<script lang="ts">
  import { resolve } from '$app/paths';
  import Backend from '$lib/components/backend/backend.svelte';
  import type { NavigationItems } from '$lib/components/backend/navigation.svelte';
  import Dark from '$lib/components/dark.svelte';
  import Floaters from '$lib/components/floating/floaters.svelte';
  import { createFloaters } from '$lib/components/floating/floaters.svelte.js';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerBalloon from '$lib/playground/icons/tabler--balloon.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
  import TablerPhoto from '$lib/playground/icons/tabler--photo.svelte';

  let { children } = $props();

  const items: NavigationItems = [
    {
      icon: LucideCat,
      route: resolve('/'),
      tooltip: 'Home',
    },
    {
      icon: TablerAppWindow,
      route: resolve('/index'),
      tooltip: 'Index demo',
    },
    {
      icon: TablerPhoto,
      route: resolve('/galleries'),
      tooltip: 'Galleries demo',
    },
    {
      icon: TablerBalloon,
      route: resolve('/floating'),
      tooltip: 'Floaters demo',
    },
    {
      icon: TablerCode,
      route: resolve('/dev'),
      tooltip: 'Dev',
    },
  ];

  let floaters = createFloaters();
</script>

<svelte:head>
  <title>tiny</title>
</svelte:head>

<Dark>
  <Backend {items}>
    {@render children()}
  </Backend>
</Dark>

<Floaters {floaters} />
