<script lang="ts">
  import { useBackend } from '../context.svelte.ts';
  import Item from './item.svelte';
  import Auth from '../../auth/navigation/item.svelte';

  let backend = useBackend();
</script>

<div class="navigation">
  <div class="items flex">
    {#each backend.items as item (item.route)}
      <Item isCurrent={item.isCurrent} icon={item.icon} name={item.name} route={item.route} />
    {/each}
  </div>
  <div class="items">
    <Auth />
  </div>
</div>

<style lang="scss">
  .navigation {
    flex: 1;
    width: min-content;
    background: #333;
    color: #fff;
    display: flex;
    flex-direction: column;
    > .items {
      display: flex;
      flex-direction: column;
      &.flex {
        flex: 1;
      }
    }
  }
</style>
