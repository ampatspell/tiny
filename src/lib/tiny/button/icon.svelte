<script lang="ts">
  import type { Component } from 'svelte';
  import Icon from '../icon.svelte';
  import { getButtonContext } from './button.svelte';

  let { icon }: { icon: Component | undefined } = $props();

  let context = getButtonContext();

  $effect.pre(() => {
    if (icon) {
      context.icon = true;
      return () => {
        context.icon = false;
      };
    }
  });
</script>

<Icon {icon} size="small" />
