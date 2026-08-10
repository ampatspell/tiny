<script lang="ts">
  import type { Snippet } from 'svelte';
  import Navigation, { type NavigationItems } from './navigation.svelte';

  let { items, children }: { items: NavigationItems; children: Snippet } = $props();
</script>

<div class="backend">
  <div class="navigation">
    <Navigation {items} />
  </div>
  <div class="content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  .backend {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .navigation {
      display: flex;
      flex-direction: column;
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
