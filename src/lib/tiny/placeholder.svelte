<script lang="ts">
  import type { Component } from 'svelte';
  import Icon from './icon.svelte';

  let { icon, label }: { icon?: Component; label?: string } = $props();
</script>

<div class="placeholder">
  <div class="content">
    <Icon {icon} size="large" />
    {#if label}
      <div class="label">{label}</div>
    {/if}
  </div>
</div>

<style lang="scss">
  .placeholder {
    cursor: default;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      > .label {
        font-size: var(--dark-font-size-small);
      }
    }
  }
</style>
