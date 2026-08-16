<script lang="ts">
  let {
    isDisabled,
    value,
    placeholder,
    multiline,
    onEnter,
    onInput,
    onBlur,
  }: {
    isDisabled?: boolean;
    value: string | undefined;
    placeholder?: string;
    multiline?: boolean;
    onEnter?: (value: string) => void;
    onInput?: (value: string) => void;
    onBlur?: () => void;
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

  let onblur = () => {
    onBlur?.();
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
  <input type="text" class="input" {placeholder} {disabled} {value} {oninput} {onkeyup} {onfocus} {onblur} />
{/if}

<style lang="scss">
  .input {
    width: 100%;
    outline: none;
    border: 1px solid var(--dark-border-color-1);
    padding: 5px 5px;
    border-radius: 3px;
    &::placeholder {
      color: var(--dark-faded-color-1);
    }
    &.textarea {
      height: 298px;
      resize: vertical;
    }
  }
</style>
