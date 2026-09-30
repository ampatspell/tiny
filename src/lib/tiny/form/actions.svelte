<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, alignment = 'right' }: { children?: Snippet; alignment?: 'right' | 'space-between' } = $props();
</script>

<div class={['actions', `alignment-${alignment}`]}>
  {@render children?.()}
</div>

<style lang="scss">
  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    &.alignment-right {
      justify-content: flex-end;
    }
    &.alignment-space-between {
      justify-content: space-between;
    }
  }
</style>
