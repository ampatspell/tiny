<script lang="ts" module>
  export type ButtonType = 'regular' | 'fill';
  export type ButtonVariant = 'regular' | 'light';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    isDisabled: _isDisabled,
    isBusy: _isBusy,
    onClick,
    children,
    type = 'regular',
    variant = 'regular',
  }: {
    isDisabled?: boolean;
    isBusy?: boolean;
    onClick: (e: MouseEvent) => void;
    label?: string;
    children?: Snippet;
    type?: ButtonType;
    variant?: ButtonVariant;
  } = $props();

  let onclick = (e: MouseEvent) => {
    onClick(e);
  };

  let isBusy = $derived(_isBusy ?? false);
  let isDisabled = $derived(_isDisabled ?? false);
  let isBusyOrDisabled = $derived(isBusy || isDisabled);

  let element = $state<HTMLButtonElement>();
  export { element };
</script>

<button
  class={['button', `type-${type}`, `variant-${variant}`]}
  class:disabled={isDisabled}
  class:busy={isBusy}
  disabled={isBusyOrDisabled}
  {onclick}
  bind:this={element}
>
  {#if children}
    {@render children()}
  {:else}
    {label}
  {/if}
</button>

<style lang="scss">
  .button {
    &.variant-regular {
      --background: var(--dark-color);
      --color: var(--dark-white-color);
      --outline: transparent;
    }
    &.variant-light {
      --background: var(--dark-white-color);
      --color: var(--dark-color);
      --outline: var(--dark-border-color-1);
    }

    appearance: none;
    outline: none;
    border: none;
    background: var(--background);
    color: var(--color);
    font-family: var(--dark-font-family);
    font-size: var(--dark-font-size);
    outline: 1px solid var(--outline);
    outline-offset: -1px;
    width: 100%;
    font-weight: 600;
    line-height: 1;
    padding: 5px 8px;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    gap: 8px;
    transition:
      0.15s ease-in-out opacity,
      0.1s ease-in-out background-color;
    &.type-regular {
      max-width: max-content;
    }
    &.type-fill {
      width: 100%;
    }
    &.busy {
      background-color: #000;
    }
    &.disabled {
      opacity: 0.25;
    }
  }
</style>
