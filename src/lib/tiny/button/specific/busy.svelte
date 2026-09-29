<script lang="ts">
  import { useBusy } from '#lib/tiny/busy.svelte.js';
  import TablerCloudFilled from '#lib/tiny/icons/tabler--cloud-filled.svelte';
  import TablerCloud from '#lib/tiny/icons/tabler--cloud.svelte';
  import Button, { type ButtonType } from '../button.svelte';
  import Icon from '../icon.svelte';
  import Label from '../label.svelte';

  let {
    label,
    type,
    onClick,
  }: {
    label: string;
    type?: ButtonType;
    onClick: () => void;
  } = $props();

  let busy = useBusy();
  let isBusy = $derived(busy.isBusy);
  let icon = $derived(isBusy ? TablerCloudFilled : TablerCloud);
</script>

<Button {onClick} {isBusy} {type}>
  <Label {label} />
  <Icon {icon} />
</Button>
