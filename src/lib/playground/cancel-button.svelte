<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import TablerCircleX from './icons/tabler--circle-x.svelte';

  let { onCancel }: { onCancel: () => void } = $props();
</script>

<Tooltip label="Discard all changes" placement="bottom-end">
  <Button onClick={onCancel} variant="light">
    <Icon icon={TablerCircleX} />
  </Button>
</Tooltip>
