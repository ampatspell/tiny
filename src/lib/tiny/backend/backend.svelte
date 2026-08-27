<script lang="ts">
  import type { Snippet } from 'svelte';
  import Navigation from './navigation/navigation.svelte';
  import { page } from '$app/state';

  let { children }: { children: Snippet } = $props();
</script>

<div class="backend">
  {#if !page.error}
    <div class="navigation">
      <Navigation />
    </div>
  {/if}
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
