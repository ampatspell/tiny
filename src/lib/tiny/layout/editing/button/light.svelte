<script lang="ts">
  import Button from '$lib/tiny/button/button.svelte';
  import Icon from '$lib/tiny/button/icon.svelte';
  import Tooltip from '$lib/tiny/floating/tooltip.svelte';
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
