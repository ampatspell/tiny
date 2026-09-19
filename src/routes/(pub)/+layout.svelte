<script lang="ts">
  import '@fontsource/raleway';

  let { children } = $props();
</script>

<div class="pub">
  {@render children()}
</div>

<style lang="scss">
  .pub {
    font-family: Raleway;
  }
</style>
