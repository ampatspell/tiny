<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100..900&display=swap" rel="stylesheet" />
</svelte:head>

<div class="pub">
  {@render children()}
</div>

<style lang="scss">
  .pub {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: Raleway;
  }
</style>
