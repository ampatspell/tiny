<script module lang="ts">
  export type CardWidth = 'fit' | 'flex';
  export type CardVariant = 'regular';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    width = 'flex',
    variant = 'regular',
  }: { children?: Snippet; width?: CardWidth; variant?: CardVariant } = $props();
</script>

<div class={['card', `width-${width}`, `variant-${variant}`]}>
  {@render children?.()}
</div>

<style lang="scss">
  .card {
    &.width-fit {
      --width: fit-content;
    }
    &.width-flex {
      --width: 100%;
    }

    &.variant-regular {
      --border-radius: 6px;
      --box-shadow:
        0px 4px 6px -2px rgba(16, 24, 40, 0.06), 0px 12px 32px -4px rgba(16, 24, 40, 0.14),
        0px 2px 8px 0px rgba(0, 0, 0, 0.12);
    }

    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    width: var(--width);
    overflow: hidden;
    background: var(--tiny-white-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }
</style>
