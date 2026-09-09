<script lang="ts">
  import type { Field as FieldType } from './models/field.svelte.ts';

  let { field }: { field: FieldType } = $props();

  let Impl = $derived(field['editor']);
</script>

<Impl {field} />
