<script lang="ts">
  import '@fontsource/ubuntu-mono/400.css';
  import '@fontsource/ubuntu-mono/700.css';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="tiny">
  {@render children?.()}
</div>

<style lang="scss">
  .tiny {
    display: contents;
    background: var(--tiny-white-color);
    font-family: var(--tiny-font-family);
    font-size: var(--tiny-font-size);
  }
</style>
