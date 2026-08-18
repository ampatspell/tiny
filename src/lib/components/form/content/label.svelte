<script lang="ts">
  import { widow } from '$lib/utils/string.js';

  let { value }: { value: string } = $props();
</script>

<div class="label">{widow(value)}</div>

<style lang="scss">
  .label {
    font-size: var(--dark-font-size-medium);
  }
</style>
