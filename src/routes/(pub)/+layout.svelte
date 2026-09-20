<script lang="ts">
  import '@fontsource/raleway';

  let { children } = $props();
</script>

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
