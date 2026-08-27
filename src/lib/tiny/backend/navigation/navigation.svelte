<script lang="ts">
  import { useBackend } from '../backend.svelte.ts';
  import Item from './item.svelte';
  import Session from './session.svelte';

  let backend = useBackend();
</script>

<div class="navigation">
  <div class="items flex">
    {#each backend.items as item (item.icon)}
      <Item isCurrent={item.isCurrent} icon={item.icon} name={item.name} route={item.route} />
    {/each}
  </div>
  <div class="items">
    <Session />
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
