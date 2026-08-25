<script lang="ts">
  import type { ResolvedPathname } from '$app/types';
  import type { Snippet } from 'svelte';

  let {
    route,
    isCurrent,
    children,
  }: {
    route: ResolvedPathname | undefined;
    isCurrent?: boolean;
    children?: Snippet;
  } = $props();
</script>

<a class={['item', isCurrent && 'current']} href={route}>
  {@render children?.()}
</a>

<style lang="scss">
  .item {
    min-height: 36px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    padding: 0 10px;
    text-decoration: none;
    border-bottom: 1px solid var(--dark-border-color-2);
    transition: 0.15s ease-in-out background-color;
    &:hover,
    &.current {
      background: var(--dark-selected-background-color-1);
    }
  }
</style>
