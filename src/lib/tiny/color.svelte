<script lang="ts">
  import { onClickOutside } from 'runed';

  let {
    value,
    onInput: _onInput,
  }: {
    value: string;
    onInput: (value: string) => void;
  } = $props();

  let input = $state<HTMLInputElement>();
  let color = $state<HTMLDivElement>();
  let isOpen = $state(false);

  let onOpen = () => {
    if (input && !isOpen) {
      isOpen = true;
      input.click();
    } else {
      isOpen = false;
    }
  };

  let onInput = () => {
    if (input) {
      _onInput(input.value);
    }
  };

  onClickOutside(
    () => color,
    () => {
      isOpen = false;
    },
  );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div bind:this={color} class="color" onclick={onOpen}>
  <div class="content" style:--color={value}></div>
  <input bind:this={input} class="input" type="color" {value} onclick={(e) => e.stopPropagation()} oninput={onInput} />
</div>

<style lang="scss">
  .color {
    width: 100%;
    height: 26px;
    border-radius: 3px;
    position: relative;
    box-shadow: inset 0 0 0 1px var(--tiny-border-color-1);
    padding: 2px;
    > .content {
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background: var(--color);
    }
    > .input {
      position: absolute;
      top: 2px;
      left: 2px;
      padding: 0;
      opacity: 0;
      border: none;
      pointer-events: none;
    }
  }
</style>
