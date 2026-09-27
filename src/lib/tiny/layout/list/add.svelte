<script lang="ts" generics="M extends Model">
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import { useFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { basic } from '#lib/tiny/floating/position.js';
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import TablerSquareRoundedPlus from '#lib/tiny/icons/tabler--square-rounded-plus.svelte';
  import { fromOptional } from '#lib/tiny/utils/action.svelte.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { goto } from '$app/navigation';
  import type { ListLayout, Model } from './layout.svelte.ts';

  let { layout }: { layout: ListLayout<M> } = $props();

  let floaters = useFloaters();
  let onAdd = async (reference: HTMLElement) => {
    let id = await floaters.open({
      snippet,
      position: basic(),
      reference: getter(() => reference),
      request: undefined,
      close: null,
    }).response;

    if (id) {
      if (layout.select) {
        await goto(layout.select(id));
      }
    }
  };

  let add = $derived(fromOptional(layout.add, 'hides', 'disables'));
  let action = $derived(add.action);
  let isHidden = $derived(add.isHidden);
  let isDisabled = $derived(add.isDisabled);

  let button = $state<Button>();
  let onClick = async () => {
    if (action?.type === 'function') {
      await action.value();
    } else if (action?.type === 'snippet') {
      let reference = button?.element;
      if (reference) {
        onAdd(reference);
      }
    }
  };
</script>

{#snippet snippet({ resolve }: { resolve: (id: string | undefined) => void })}
  {#if action?.type === 'snippet'}
    {@render action.value(resolve)}
  {/if}
{/snippet}

{#if add && !isHidden}
  <Tooltip label="Add new" placement="right" {isDisabled}>
    <Button bind:this={button} variant="light" {onClick} {isDisabled}>
      <Icon icon={TablerSquareRoundedPlus} />
    </Button>
  </Tooltip>
{/if}
