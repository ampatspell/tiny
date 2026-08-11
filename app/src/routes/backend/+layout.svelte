<script lang="ts">
  import LucideCat from '#lib/icons/lucide--cat.svelte';
  import TablerAppWindow from '#lib/icons/tabler--app-window.svelte';
  import TablerCircleChevronLeft from '#lib/icons/tabler--circle-chevron-left.svelte';
  import { resolve } from '$app/paths';
  import Backend from '@ampatspell/cave/components/backend/backend.svelte';
  import { type NavigationItems } from '@ampatspell/cave/components/backend/navigation.svelte';

  let { children } = $props();

  const items: NavigationItems = [
    {
      icon: TablerCircleChevronLeft,
      route: resolve('/'),
    },
    {
      icon: LucideCat,
      route: resolve('/backend'),
    },
    {
      icon: TablerAppWindow,
      route: resolve('/backend/index'),
    },
  ];
</script>

<Backend {items}>
  {@render children()}
</Backend>
