<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import Label from '$lib/components/button/label.svelte';
  import TablerCloudFilled from '$lib/icons/tabler--cloud-filled.svelte';
  import TablerCloud from '$lib/icons/tabler--cloud.svelte';

  let { label, onClick: _onClick }: { label: string; onClick: () => Promise<unknown> } = $props();

  let isBusy = $state(false);

  let onClick = async () => {
    try {
      isBusy = true;
      await _onClick();
    } finally {
      isBusy = false;
    }
  };

  let icon = $derived(isBusy ? TablerCloudFilled : TablerCloud);
</script>

<Button {onClick} {isBusy}>
  <Label {label} />
  <Icon {icon} />
</Button>
