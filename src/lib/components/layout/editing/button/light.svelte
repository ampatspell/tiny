<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Icon from '$lib/components/button/icon.svelte';
  import Tooltip from '$lib/components/floating/tooltip.svelte';
  import type { Component } from 'svelte';

  let {
    label,
    icon,
    onClick: _onClick,
  }: {
    label: string;
    icon: Component;
    onClick: (reference: HTMLElement) => void;
  } = $props();

  let button = $state<Button>();

  let onClick = () => {
    let reference = button?.element;
    if (reference) {
      _onClick(reference);
    }
  };
</script>

<Tooltip {label} placement="bottom-end">
  <Button bind:this={button} variant="light" {onClick}>
    <Icon {icon} />
  </Button>
</Tooltip>
