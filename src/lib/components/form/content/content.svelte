<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="content">
  {@render children()}
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
