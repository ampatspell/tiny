<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Icon from '$lib/components/icon.svelte';
  import TablerCloudUp from './icons/tabler--cloud-up.svelte';
  import TablerCloud from './icons/tabler--cloud.svelte';

  let { label, onClick: _onClick }: { label: string; onClick: () => Promise<void> } = $props();

  let isBusy = $state(false);

  let onClick = async () => {
    try {
      isBusy = true;
      await _onClick();
    } finally {
      isBusy = false;
    }
  };

  let icon = $derived(isBusy ? TablerCloudUp : TablerCloud);
</script>

<Button {onClick} {isBusy}>
  {label}
  <Icon {icon} size="small" />
</Button>
