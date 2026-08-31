<script lang="ts" generics="T = Any, E extends TField<T> = TField<T>">
  import type { Any } from '../utils/utils.ts';
  import type { Field as TField } from './utils.svelte.ts';

  let { field }: { field: E } = $props();

  let Impl = $derived(field.component);
</script>

<Impl {field} />
