<script lang="ts">
  import Dark from '@ampatspell/cave/components/dark.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>cave</title>
</svelte:head>

<Dark>
  {@render children()}
</Dark>
