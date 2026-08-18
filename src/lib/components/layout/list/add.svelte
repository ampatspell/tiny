<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import TablerSquareRoundedPlus from '$lib/playground/icons/tabler--square-rounded-plus.svelte';

  let { onAdd: _onAdd }: { onAdd: (reference: HTMLElement) => void } = $props();

  let button = $state<Button>();
  let onAdd = () => {
    let reference = button?.element;
    if (reference) {
      _onAdd(reference);
    }
  };
</script>

<Tooltip label="Add new" placement="right">
  <Button bind:this={button} variant="light" onClick={onAdd}>
    <Icon icon={TablerSquareRoundedPlus} />
  </Button>
</Tooltip>
