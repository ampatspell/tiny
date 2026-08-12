<script lang="ts">
  import { resolve } from '$app/paths';
  import Backend from '$lib/components/backend/backend.svelte';
  import type { NavigationItems } from '$lib/components/backend/navigation.svelte';
  import Dark from '$lib/components/dark.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerAppWindow from '$lib/playground/icons/tabler--app-window.svelte';

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
