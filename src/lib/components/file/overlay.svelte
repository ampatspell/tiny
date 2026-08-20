<script lang="ts">
  import type { Component } from 'svelte';
  import Icon from '../icon.svelte';
  import TablerCircleX from '$lib/icons/tabler--circle-x.svelte';

  let {
    icon,
    label,
    hover,
    onDelete: _onDelete,
  }: {
    icon: Component;
    label: string;
    hover?: boolean;
    onDelete?: () => void;
  } = $props();

  let onDelete = (e: MouseEvent) => {
    e.stopPropagation();
    _onDelete?.();
  };
</script>

<div class={['overlay', hover && 'on-hover']}>
  <Icon {icon} size="medium" />
  <div class="label">{label}</div>
  {#if _onDelete}
    <div class="delete">
      <Icon icon={TablerCircleX} onClick={onDelete} />
    </div>
  {/if}
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
    > .delete {
      opacity: 0;
      position: absolute;
      top: 5px;
      left: 5px;
      transition: 0.15s ease-in-out opacity;
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
    &:hover {
      > .delete {
        opacity: 1;
      }
    }
  }
</style>
