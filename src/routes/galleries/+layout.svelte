<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import Item from '$lib/components/list/item/item.svelte';
  import Label from '$lib/components/list/item/label.svelte';
  import List from '$lib/components/list/list.svelte';
  import Add from '$lib/playground/galleries/add/add.svelte';
  import { getGalleries } from '$lib/playground/galleries/galleries.remote.js';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  let id = $derived(page.params.id);
  let galleries = $derived(await getGalleries());
</script>

<div class="page">
  <div class="sidebar">
    <List route={resolve('/galleries')}>
      {#snippet top()}
        <Header>
          <Title label="Galleries" />
          {#snippet accessories()}
            <Add />
          {/snippet}
        </Header>
      {/snippet}
      {#each galleries as gallery (gallery.id)}
        <Item route={resolve('/galleries/[id]', { id: gallery.id })} isCurrent={gallery.id === id}>
          <Label label={gallery.name} description={gallery.permalink} />
        </Item>
      {/each}
    </List>
  </div>
  <div class="detail">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--dark-border-color-1);
    }
    > .detail {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
