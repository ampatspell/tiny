<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>Welcome to Tiny</title>
</svelte:head>

{@render children()}
