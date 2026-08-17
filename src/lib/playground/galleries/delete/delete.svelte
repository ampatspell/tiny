<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import TablerTrashX from '$lib/playground/icons/tabler--trash-x.svelte';
  import { deleteGallery, type GalleryData } from '../galleries.remote.ts';

  let { gallery }: { gallery: GalleryData } = $props();

  let button = $state<Button>();
  let onDelete = async () => {
    await deleteGallery({ id: gallery.id });
    goto(resolve('/galleries'), { replaceState: true });
  };
</script>

<Tooltip label="Delete this gallery" placement="left">
  <Button bind:this={button} variant="light" onClick={onDelete}>
    <Icon icon={TablerTrashX} />
  </Button>
</Tooltip>
