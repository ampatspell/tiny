<script lang="ts" module>
  export type ButtonType = 'button' | 'submit';
  export type ButtonVariant = 'regular' | 'light';

  class ButtonContext {
    label = $state(false);
    icon = $state(false);
  }

  let [getButtonContext, setButtonContext] = createContext<ButtonContext>();

  export { getButtonContext, setButtonContext };

  export type BaseButtonProps = {
    isDisabled?: boolean;
    isBusy?: boolean;
    label?: string;
    children?: Snippet;
    variant?: ButtonVariant;
  };

  export type ButtonProps = BaseButtonProps &
    (
      | {
          type?: 'button' | undefined;
          onClick: (e: MouseEvent) => void;
        }
      | {
          type: 'submit';
        }
      | {
          type: 'link';
          route: ResolvedPathname | undefined;
        }
    );
</script>

<script lang="ts">
  import type { ResolvedPathname } from '$app/types';
  import { createContext, type Snippet } from 'svelte';
  import Label from './label.svelte';

  let props: ButtonProps = $props();
  let label = $derived(props.label);
  let children = $derived(props.children);
  let isBusy = $derived(props.isBusy ?? false);
  let isDisabled = $derived(props.isDisabled ?? false);
  let isBusyOrDisabled = $derived(isBusy || isDisabled);
  let variant = $derived(props.variant ?? 'regular');

  let context = setButtonContext(new ButtonContext());
  let element = $state<HTMLButtonElement | HTMLAnchorElement>();

  let onclick = (e: MouseEvent) => {
    if (props.type === 'button' || props.type === undefined) {
      props.onClick?.(e);
    }
  };

  export { element };

  let classes = $derived([
    'button',
    `variant-${variant}`,
    context.label && 'has-label',
    isDisabled && 'disabled',
    isBusy && 'busy',
  ]);
</script>

{#snippet content()}
  {#if children}
    {@render children()}
  {:else}
    <Label {label} />
  {/if}
{/snippet}

{#if !props.type || props.type === 'button' || props.type === 'submit'}
  <button class={classes} disabled={isBusyOrDisabled} type={props.type ?? 'button'} {onclick} bind:this={element}>
    {@render content()}
  </button>
{:else if props.type === 'link'}
  <a href={props.route ?? '#'} class={classes} bind:this={element}>
    {@render content()}
  </a>
{/if}

<style lang="scss">
  .button {
    &.variant-regular {
      --background: var(--tiny-color);
      --color: var(--tiny-white-color);
      --outline: transparent;
    }
    &.variant-light {
      --background: var(--tiny-white-color);
      --color: var(--tiny-color);
      --outline: var(--tiny-border-color-1);
    }

    --padding: 5px;
    &.has-label {
      --padding: 4px 8px;
    }

    appearance: none;
    outline: none;
    border: none;
    background: var(--background);
    color: var(--color);
    font-family: var(--tiny-font-family);
    font-size: var(--tiny-font-size);
    text-decoration: none;
    outline: 1px solid var(--outline);
    outline-offset: -1px;
    width: 100%;
    font-weight: 700;
    line-height: 1;
    padding: var(--padding);
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: max-content;
    white-space: nowrap;
    gap: 8px;
    transition:
      0.15s ease-in-out opacity,
      0.1s ease-in-out background-color;
    &.busy {
      background-color: #000;
    }
    &.disabled {
      opacity: 0.25;
      pointer-events: none;
    }
  }
</style>
