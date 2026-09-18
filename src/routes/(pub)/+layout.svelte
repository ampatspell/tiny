<script lang="ts">
  import '@fontsource/raleway';

  let { children } = $props();
</script>

<div class="public">
  {@render children()}
</div>

<style lang="scss">
  .public {
    display: contents;
    font-family: 'Raleway', system-ui;
  }
</style>
