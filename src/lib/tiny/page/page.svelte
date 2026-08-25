<script lang="ts">
  import type { Snippet } from 'svelte';
  import Header from '../header/header.svelte';
  import Title from '../header/title.svelte';

  let {
    label,
    children,
    accessories: _accessories,
  }: {
    label: string;
    children: Snippet;
    accessories?: Snippet;
  } = $props();
</script>

<div class="page">
  <Header>
    <Title {label} />
    {#snippet accessories()}
      {@render _accessories?.()}
    {/snippet}
  </Header>
  <div class="content">
    <div class="overflow">
      {@render children()}
    </div>
  </div>
</div>

<style lang="scss">
  .page {
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
