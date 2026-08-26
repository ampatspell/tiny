<script lang="ts" generics="M extends Model">
  import { goto } from '$app/navigation';
  import Button from '$lib/tiny/button/button.svelte';
  import Icon from '$lib/tiny/button/icon.svelte';
  import { useFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import { basic } from '$lib/tiny/floating/position.js';
  import Tooltip from '$lib/tiny/floating/tooltip.svelte';
  import TablerSquareRoundedPlus from '$lib/tiny/icons/tabler--square-rounded-plus.svelte';
  import type { ListLayout, Model } from './list.svelte.ts';

  let { layout }: { layout: ListLayout<M> } = $props();

  let floaters = useFloaters();
  let onAdd = async (reference: HTMLElement) => {
    let id = await floaters.open({
      snippet,
      position: basic(),
      reference: () => reference,
      request: undefined,
      close: null,
    }).response;

    if (id) {
      if (layout.select) {
        await goto(layout.select(id));
      }
    }
  };

  let button = $state<Button>();
  let onClick = () => {
    let reference = button?.element;
    if (reference) {
      onAdd(reference);
    }
  };

  let add = $derived(layout.add);
</script>

{#snippet snippet({ resolve }: { resolve: (id: string | undefined) => void })}
  {@render add(resolve)}
{/snippet}

<Tooltip label="Add new" placement="right">
  <Button bind:this={button} variant="light" {onClick}>
    <Icon icon={TablerSquareRoundedPlus} />
  </Button>
</Tooltip>
