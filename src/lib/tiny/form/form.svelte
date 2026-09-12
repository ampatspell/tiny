<script module lang="ts">
  export type Size = 'small' | 'regular' | 'wide' | 'fill';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    size = 'small',
    onSubmit,
    children,
  }: {
    size?: Size;
    onSubmit?: () => void;
    children?: Snippet;
  } = $props();

  let onsubmit = () => {
    onSubmit?.();
  };
</script>

<form class={['form', `size-${size}`]} {onsubmit}>
  {@render children?.()}
</form>

<style lang="scss">
  .form {
    &.size-small {
      --min: 280px;
      --max: 320px;
      --width: fit-content;
    }
    &.size-regular {
      --min: 280px;
      --max: 450px;
      --width: auto;
    }
    &.size-wide {
      --min: 280px;
      --max: 710px;
      --width: auto;
    }
    &.size-fill {
      --max: 100%;
      --width: 100%;
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    min-width: var(--min);
    max-width: var(--max);
    width: var(--width);
  }
</style>
