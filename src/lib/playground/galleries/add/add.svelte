<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { basic } from '$lib/components/floating/position.js';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import TablerSquareRoundedPlus from '../../icons/tabler--square-rounded-plus.svelte';
  import Card from './card.svelte';

  let floaters = useFloaters();
  let button = $state<Button>();

  let onAdd = async () => {
    let id = await floaters.open({
      snippet,
      position: basic,
      reference: () => button?.element,
      request: undefined,
      close: undefined,
    }).response;

    if (id) {
      await goto(resolve('/galleries/[id]', { id }));
    }
  };
</script>

{#snippet snippet({ resolve }: { resolve: (res: string | undefined) => void })}
  <Card onDone={resolve} />
{/snippet}

<Tooltip label="Add new gallery" placement="right">
  <Button bind:this={button} variant="light" onClick={onAdd}>
    <Icon icon={TablerSquareRoundedPlus} />
  </Button>
</Tooltip>
