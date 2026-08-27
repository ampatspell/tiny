<script lang="ts">
  import Item from './item.svelte';
  import type { Item as ItemModel } from './item.svelte.ts';

  let { flex, items }: { flex?: boolean; items: ItemModel[] } = $props();
</script>

<div class={['items', flex && 'flex']}>
  {#each items as item (item.icon)}
    <Item {item} />
  {/each}
</div>

<style lang="scss">
  .items {
    display: flex;
    flex-direction: column;
    &.flex {
      flex: 1;
    }
  }
</style>
