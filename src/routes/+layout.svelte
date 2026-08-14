<script lang="ts">
  import { resolve } from '$app/paths';
  import Backend from '$lib/components/backend/backend.svelte';
  import type { NavigationItems } from '$lib/components/backend/navigation.svelte';
  import Dark from '$lib/components/dark.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';
  import TablerBalloon from '$lib/playground/icons/tabler--balloon.svelte';
  import TablerFileText from '$lib/playground/icons/tabler--file-text.svelte';

  let { children } = $props();

  const items: NavigationItems = [
    {
      icon: LucideCat,
      route: resolve('/'),
    },
    {
      icon: TablerAppWindow,
      route: resolve('/index'),
    },
    {
      icon: TablerFileText,
      route: resolve('/list'),
    },
    {
      icon: TablerBalloon,
      route: resolve('/floating'),
    },
  ];
</script>

<svelte:head>
  <title>tiny</title>
</svelte:head>

<Dark>
  <Backend {items}>
    {@render children()}
  </Backend>
</Dark>
