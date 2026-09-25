<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="pills">
  {@render children?.()}
</div>

<style lang="scss">
  .pills {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 0 1px;
  }
</style>
