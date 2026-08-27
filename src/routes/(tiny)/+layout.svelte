<script lang="ts">
  import Tiny from '$lib/tiny/tiny.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>Welcome to Tiny</title>
</svelte:head>

<Tiny>
  {@render children()}
</Tiny>
