<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="form">
  {@render children()}
</div>

<style lang="scss">
  .form {
    padding: 10px;
    width: 270px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
