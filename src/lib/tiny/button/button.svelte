<script lang="ts" module>
  export type ButtonType = 'regular' | 'fill';
  export type ButtonVariant = 'regular' | 'light';

  class ButtonContext {
    label = $state(false);
    icon = $state(false);
  }

  let [getButtonContext, setButtonContext] = createContext<ButtonContext>();

  export { getButtonContext, setButtonContext };
</script>

<script lang="ts">
  import { createContext, type Snippet } from 'svelte';
  import Label from './label.svelte';

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

  let context = setButtonContext(new ButtonContext());

  let isBusy = $derived(_isBusy ?? false);
  let isDisabled = $derived(_isDisabled ?? false);
  let isBusyOrDisabled = $derived(isBusy || isDisabled);

  let element = $state<HTMLButtonElement>();
  export { element };
</script>

<button
  class={['button', `type-${type}`, `variant-${variant}`, context.label && 'has-label']}
  class:disabled={isDisabled}
  class:busy={isBusy}
  disabled={isBusyOrDisabled}
  {onclick}
  bind:this={element}
>
  {#if children}
    {@render children()}
  {:else}
    <Label {label} />
  {/if}
</button>

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
