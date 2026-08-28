<script lang="ts">
  import type { InputType } from './input.ts';

  let {
    isDisabled,
    type,
    value,
    placeholder,
    multiline,
    onEnter,
    onInput,
    onBlur,
  }: {
    isDisabled?: boolean;
    type?: InputType;
    value: string | undefined;
    placeholder?: string;
    multiline?: boolean;
    onEnter?: (value: string) => void;
    onInput?: (value: string) => void;
    onBlur?: (value: string) => void;
  } = $props();

  let initial: string | undefined;

  let targetAsInput = (e: Event) => {
    return e.target as HTMLInputElement;
  };

  let onkeyup = (e: KeyboardEvent) => {
    let input = targetAsInput(e);
    if (e.key === 'Enter') {
      if (!multiline) {
        onEnter?.(input.value);
        input.blur();
      }
    } else if (e.key === 'Escape') {
      onInput?.(initial ?? '');
      input.blur();
    }
  };

  let onfocus = () => {
    initial = value;
  };

  let onblur = (e: Event) => {
    let input = targetAsInput(e);
    onBlur?.(input.value);
  };

  let oninput = (e: Event) => {
    let input = targetAsInput(e);
    onInput?.(input.value);
  };

  let disabled = $derived(isDisabled);
</script>

{#if multiline}
  <textarea class="input textarea" {placeholder} {disabled} {value} {oninput} {onkeyup} {onfocus} {onblur}></textarea>
{:else}
  <input type={type ?? 'text'} class="input" {placeholder} {disabled} {value} {oninput} {onkeyup} {onfocus} {onblur} />
{/if}

<style lang="scss">
  .input {
    width: 100%;
    outline: none;
    border: 1px solid var(--tiny-border-color-1);
    padding: 5px 5px;
    border-radius: 3px;
    font-size: var(--tiny-font-size-medium);
    &::placeholder {
      color: var(--tiny-faded-color-1);
    }
    &.textarea {
      height: 298px;
      resize: vertical;
    }
  }
</style>
