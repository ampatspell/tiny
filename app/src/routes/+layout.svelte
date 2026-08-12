<script lang="ts">
  import Dark from '@ampatspell/tiny/components/dark.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>tiny</title>
</svelte:head>

<Dark>
  {@render children()}
</Dark>
