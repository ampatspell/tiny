<script lang="ts">
  import { setGlobal } from './utils/set-global.ts';

  let { data }: { data: unknown } = $props();
  let string = $derived.by(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (err) {
      setGlobal({ data, err });
    }
  });
</script>

<div class="json">{string}</div>

<style lang="scss">
  .json {
    white-space: pre-wrap;
    font-size: var(--tiny-font-size-small);
  }
</style>
