<script lang="ts">
  import Icon from '$lib/tiny/icon.svelte';
  import type { Component } from 'svelte';

  let { icon }: { icon?: Component } = $props();
</script>

{#if icon}
  <Icon {icon} size="small" />
{/if}
