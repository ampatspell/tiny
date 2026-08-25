<script lang="ts">
  import TablerCloudFilled from '$lib/tiny/icons/tabler--cloud-filled.svelte';
  import TablerCloud from '$lib/tiny/icons/tabler--cloud.svelte';
  import Button from '../button.svelte';
  import Icon from '../icon.svelte';
  import Label from '../label.svelte';

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
