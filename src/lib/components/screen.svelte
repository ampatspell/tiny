<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="screen">
  {@render children()}
</div>

<style lang="scss">
  .screen {
    flex: 1;
    width: 100%;
    max-width: 1024px;
    max-height: 576px;
    border: 1px solid #eee;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow:
      0px 4px 6px -2px rgba(16, 24, 40, 0.06),
      0px 12px 32px -4px rgba(16, 24, 40, 0.14),
      0px 2px 8px 0px rgba(0, 0, 0, 0.12);
  }
</style>
