<script lang="ts">
  import TinyIcon from '$lib/tiny/icon.svelte';
  import type { Component } from 'svelte';

  let { icon }: { icon?: Component } = $props();
</script>

{#if icon}
  <TinyIcon {icon} size="small" />
{/if}
