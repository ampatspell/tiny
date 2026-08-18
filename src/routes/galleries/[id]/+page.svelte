<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import Delete from '$lib/playground/galleries/delete/delete.svelte';
  import { getGalleryById } from '$lib/playground/galleries/galleries.remote.js';
  import Properties from '$lib/playground/galleries/properties.svelte';

  let id = $derived(page.params.id!);
  let gallery = $derived(await getGalleryById({ id }));
</script>

{#if gallery}
  <div class="page">
    <Header>
      <Title label={gallery.name} />
      {#snippet accessories()}
        <Delete {gallery} />
      {/snippet}
    </Header>
    <div class="content">
      <Properties {gallery} />
    </div>
  </div>
{/if}

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
