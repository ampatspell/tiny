<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="row">
  {@render children()}
</div>

<style lang="scss">
  .row {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
</style>
