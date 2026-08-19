<script module lang="ts">
  export type Size = 'small' | 'regular';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let { size = 'small', children }: { size?: Size; children: Snippet } = $props();
</script>

<div class={['form', `size-${size}`]}>
  {@render children()}
</div>

<style lang="scss">
  .form {
    --min: 280px;
    &.size-small {
      --max: 320px;
      --width: fit-content;
    }
    &.size-regular {
      --max: 450px;
      --width: auto;
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
