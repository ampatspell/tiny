<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { basic } from '$lib/components/floating/position.js';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import TablerTrashX from '$lib/playground/icons/tabler--trash-x.svelte';
  import { deleteGallery, type GalleryData } from '../galleries.remote.ts';
  import Card from './card.svelte';

  let { gallery }: { gallery: GalleryData } = $props();

  let floaters = useFloaters();
  let button = $state<Button>();

  let onDelete = async () => {
    let ok = await floaters.open({
      snippet,
      request: undefined,
      reference: () => button?.element,
      position: basic,
      close: false,
    }).response;

    if (ok) {
      await deleteGallery({ id: gallery.id });
      goto(resolve('/galleries'), { replaceState: true });
    }
  };
</script>

{#snippet snippet({ resolve }: { resolve: (res: boolean) => void })}
  <Card onDone={resolve} />
{/snippet}

<Tooltip label="Delete this gallery" placement="bottom-end">
  <Button bind:this={button} variant="light" onClick={onDelete}>
    <Icon icon={TablerTrashX} />
  </Button>
</Tooltip>
