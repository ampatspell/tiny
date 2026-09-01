<script lang="ts">
  import { widow } from '#lib/tiny/utils/string.js';

  let { value = '' }: { value: string | undefined } = $props();
</script>

<div class="label">{widow(value)}</div>

<style lang="scss">
  .label {
    font-size: var(--tiny-font-size-small);
  }
</style>
