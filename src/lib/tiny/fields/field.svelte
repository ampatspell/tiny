<script lang="ts" generics="T = Any, E extends Field<T>=Field<T>">
  import type { Any, Field } from './field.svelte.ts';

  let { field }: { field: E } = $props();
  let Impl = $derived(field.component);
</script>

<Impl {field} />
