<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { basic } from '$lib/components/floating/position.js';
  import List from '$lib/components/layout/list/list.svelte';
  import SplitView from '$lib/components/layout/split-view.svelte';
  import Item from '$lib/components/list/item/item.svelte';
  import Label from '$lib/components/list/item/label.svelte';
  import Add from '$lib/playground/galleries/add.svelte';
  import { getGalleries } from '$lib/playground/galleries/galleries.remote.js';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  let floaters = useFloaters();

  let id = $derived(page.params.id);
  let galleries = $derived(await getGalleries());

  let onAdd = async (reference: HTMLElement) => {
    let id = await floaters.open({
      snippet: add,
      position: basic,
      reference: () => reference,
      request: undefined,
      close: null,
    }).response;

    if (id) {
      await goto(resolve('/galleries/[id]', { id }));
    }
  };
</script>

{#snippet add({ resolve }: { resolve: (id: string | undefined) => void })}
  <Add onDone={resolve} />
{/snippet}

<SplitView>
  {#snippet sidebar()}
    <List route={resolve('/galleries')} title="Galleries" {onAdd}>
      {#each galleries as gallery (gallery.id)}
        <Item route={resolve('/galleries/[id]', { id: gallery.id })} isCurrent={gallery.id === id}>
          <Label label={gallery.name} description={gallery.permalink} />
        </Item>
      {/each}
    </List>
  {/snippet}
  {@render children?.()}
</SplitView>
