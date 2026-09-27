<script lang="ts">
  import Fonts from '#lib/tiny/fonts.svelte';

  let { children } = $props();
</script>

<Fonts
  fonts={{
    families: { Raleway: { wght: '100..900' } },
    display: 'swap',
  }}
/>

<div class="public">
  {@render children()}
</div>

<style lang="scss">
  .public {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-family: Raleway, sans-serif;
  }
</style>
