<script lang="ts">
  import Dark from '#lib/cave/components/dark.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>cave</title>
</svelte:head>

<Dark>
  {@render children()}
</Dark>
