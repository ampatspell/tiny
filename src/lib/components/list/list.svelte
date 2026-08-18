<script lang="ts">
  import { goto } from '$app/navigation';
  import type { ResolvedPathname } from '$app/types';
  import type { Snippet } from 'svelte';

  let { header, children, route }: { header?: Snippet; children?: Snippet; route?: ResolvedPathname } = $props();

  let list = $state<HTMLElement>();
  let onclick = (e: MouseEvent) => {
    if (e.target === list) {
      if (route) {
        goto(route);
      }
    }
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="list" {onclick}>
  {@render header?.()}
  <div class="content">
    <div class="overflow">
      <div class="content" bind:this={list}>
        {@render children?.()}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .list {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      position: relative;
      > .overflow {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-y: auto;
        > .content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
      }
    }
  }
</style>
