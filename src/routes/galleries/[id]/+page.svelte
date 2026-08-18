<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import Button from '$lib/components/button/button.svelte';
  import BusyButton from '$lib/playground/busy-button.svelte';
  import Delete from '$lib/playground/galleries/delete/delete.svelte';
  import { getGalleryById } from '$lib/playground/galleries/galleries.remote.js';
  import { useEditGalleryProperties } from '$lib/playground/galleries/gallery.svelte.js';
  import Properties from '$lib/playground/galleries/properties.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';

  let id = $derived(page.params.id!);
  usePropertiesContext();
  let gallery = $derived(await getGalleryById({ id }));
  let properties = useEditGalleryProperties({ data: getter(() => gallery) });
  let onSave = () => properties.save();
  let onCancel = () => properties.rollback();
</script>

{#if gallery}
  <div class="page">
    <Header>
      <Title label={gallery.name} />
      {#snippet accessories()}
        {#if properties.isDirty}
          <BusyButton label="Save" onClick={onSave} />
          <Button label="Cancel" onClick={onCancel} />
        {/if}
        <Delete {gallery} />
      {/snippet}
    </Header>
    <div class="content">
      <Properties {properties} />
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
