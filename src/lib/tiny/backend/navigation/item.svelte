<script module lang="ts">
  export type ItemProps = {
    isCurrent?: boolean;
    name?: string;
    icon: Component;
  } & (
    | {
        route: ResolvedPathname;
      }
    | {
        onClick: (e: MouseEvent) => void;
      }
  );
</script>

<script lang="ts">
  import type { ResolvedPathname } from '$app/types';
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import Icon from '#lib/tiny/icon.svelte';
  import type { Component } from 'svelte';

  // eslint-disable-next-line svelte/no-unused-props
  let props: ItemProps = $props();
  let classes = $derived(['item', props.isCurrent && 'current']);

  let element = $state<HTMLElement>();

  export { element };
</script>

{#snippet content()}
  <Tooltip label={props.name} offset={16} placement="right">
    <Icon icon={props.icon} />
  </Tooltip>
{/snippet}

{#if 'route' in props}
  <a bind:this={element} class={classes} href={props.route}>{@render content()}</a>
{:else}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div bind:this={element} class={classes} onclick={props.onClick}>{@render content()}</div>
{/if}

<style lang="scss">
  .item {
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 5px;
    align-items: center;
    font-size: var(--tiny-font-size-small);
    text-decoration: none;
    &:hover {
      background: #222;
    }
    &.current {
      background: #111;
    }
  }
</style>
