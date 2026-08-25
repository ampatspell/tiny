<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<div class="header">
  <div class="title">{title}</div>
  {#if children}
    <div class="accessories">
      {@render children?.()}
    </div>
  {/if}
</div>

<style lang="scss">
  .header {
    cursor: default;
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding: 2px 0 0 0;
    > .title {
      font-weight: 600;
      flex: 1;
    }
    > .accessories {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }
  }
</style>
