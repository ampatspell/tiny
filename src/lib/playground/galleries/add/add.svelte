<script lang="ts">
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
    await floaters.open({
      snippet,
      position: basic,
      reference: () => button?.element,
      request: undefined,
      close: false,
    }).response;
  };
</script>

{#snippet snippet({ resolve }: { resolve: (res: boolean) => void })}
  <Card onDone={resolve} />
{/snippet}

<Tooltip label="Add new gallery">
  <Button bind:this={button} variant="light" onClick={onAdd}>
    <Icon icon={TablerSquareRoundedPlus} />
  </Button>
</Tooltip>
