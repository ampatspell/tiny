<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import Icon from './icon.svelte';

  let { icon, label, children }: { icon?: Component; label?: string; children?: Snippet } = $props();
</script>

<div class="placeholder">
  <div class="content">
    <Icon {icon} size="large" />
    {#if label}
      <div class="label">{label}</div>
    {/if}
    {#if children}
      <div class="actions">
        {@render children()}
      </div>
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
        font-size: var(--tiny-font-size-small);
      }
      > .actions {
        padding: 10px 0 0 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
    }
  }
</style>
