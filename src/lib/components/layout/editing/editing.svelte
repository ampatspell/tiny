<script lang="ts" generics="M extends Model, P extends Properties">
  import Header from '$lib/components/header/header.svelte';
  import Title from '$lib/components/header/title.svelte';
  import type { Snippet } from 'svelte';
  import Delete from './button/delete.svelte';
  import Save from './button/save.svelte';
  import Discard from './button/discard.svelte';
  import type { EditingLayout, Model, Properties } from './editing.svelte.ts';

  let {
    layout,
    children,
  }: {
    layout: EditingLayout<M, P>;
    children: Snippet;
  } = $props();

  let label = $derived(layout.title);
</script>

<div class="editing">
  <Header>
    <Title {label} />
    {#snippet accessories()}
      <Save {layout} />
      <Discard {layout} />
      <Delete {layout} />
    {/snippet}
  </Header>
  <div class="content">
    <div class="overflow">
      {@render children()}
    </div>
  </div>
</div>

<style lang="scss">
  .editing {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      > .overflow {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
