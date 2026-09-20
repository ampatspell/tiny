<script lang="ts">
  import TablerCloudFilled from '#lib/tiny/icons/tabler--cloud-filled.svelte';
  import TablerCloud from '#lib/tiny/icons/tabler--cloud.svelte';
  import Button, { type ButtonType } from '../button.svelte';
  import Icon from '../icon.svelte';
  import Label from '../label.svelte';

  let {
    label,
    type,
    isBusy,
    onClick,
  }: {
    label: string;
    type?: ButtonType;
    isBusy: boolean;
    onClick: () => void;
  } = $props();

  let icon = $derived(isBusy ? TablerCloudFilled : TablerCloud);
</script>

<Button {onClick} {isBusy} {type}>
  <Label {label} />
  <Icon {icon} />
</Button>
