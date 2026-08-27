<script lang="ts">
  import { useBackend } from '../backend.svelte.ts';
  import Items from './items.svelte';

  let backend = useBackend();
</script>

<div class="navigation">
  <Items items={backend.items} flex={true} />
</div>

<style lang="scss">
  .navigation {
    flex: 1;
    width: min-content;
    background: #333;
    color: #fff;
    display: flex;
    flex-direction: column;
  }
</style>
