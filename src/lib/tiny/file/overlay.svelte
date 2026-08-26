<script lang="ts">
  import type { Component } from 'svelte';
  import Icon from '../icon.svelte';
  import { isbn } from 'valibot';

  let {
    icon,
    label,
    hover,
    isBusy,
  }: {
    icon: Component;
    label: string;
    hover?: boolean;
    isBusy?: boolean;
  } = $props();
</script>

<div class={['overlay', hover && 'on-hover', isBusy && 'is-busy']}>
  <Icon {icon} size="medium" />
  <div class="label">{label}</div>
</div>

<style lang="scss">
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 0;
    > .label {
      padding: 0 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &.on-hover {
      opacity: 0;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(1px);
      transition: 0.15s ease-in-out opacity;
      &:hover {
        opacity: 1;
      }
    }
    &.is-busy {
      opacity: 1;
    }
  }
</style>
