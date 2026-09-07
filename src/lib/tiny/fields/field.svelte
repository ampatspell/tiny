<script lang="ts" generics="F extends FieldType">
  import type { Field as FieldType } from './field.svelte.ts';
  let { field }: { field: F } = $props();

  let Impl = $derived(field['editor']);
</script>

<Impl {field} />
