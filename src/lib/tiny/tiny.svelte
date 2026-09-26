<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="tiny">
  {@render children?.()}
</div>

<style lang="scss">
  .tiny {
    display: contents;
    font-family: var(--tiny-font-family);
    font-size: var(--tiny-font-size);
    font-weight: var(--tiny-font-weight);
  }
</style>
