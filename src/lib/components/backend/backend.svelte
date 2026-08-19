<script lang="ts">
  import type { Snippet } from 'svelte';
  import Navigation from './navigation.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="backend">
  <div class="navigation">
    <Navigation />
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
