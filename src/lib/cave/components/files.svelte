<script lang="ts">
  import Button, { type ButtonType } from './button.svelte';

  let {
    isDisabled,
    isMultiple,
    label: _label,
    type,
    onFiles,
  }: {
    isDisabled?: boolean;
    isMultiple?: boolean;
    label?: string;
    type?: ButtonType;
    onFiles: (files: File[]) => void;
  } = $props();

  let input = $state<HTMLInputElement>();

  let multiple = $derived(isMultiple ?? true);
  let label = $derived(_label ?? 'Choose files');

  let onchange = () => {
    if (input) {
      let files = [...input.files!];
      input.value = '';
      onFiles(files);
    }
  };

  let onClick = () => {
    input?.click();
  };
</script>

<div class="files">
  <Button {label} {isDisabled} {onClick} {type} />
  <input class="input" type="file" bind:this={input} {multiple} {onchange} />
</div>

<style lang="scss">
  .files {
    > .input {
      display: none;
    }
  }
</style>
