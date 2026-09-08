<script lang="ts">
  import type { Field } from './models/field.svelte.ts';

  let { field }: { field: Field } = $props();

  let Impl = $derived(field['editor']);
</script>

<Impl {field} />
