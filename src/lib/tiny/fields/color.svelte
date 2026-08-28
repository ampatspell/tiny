<script lang="ts" generics="T">
  import Color from '$lib/tiny/color.svelte';
  import Container from './container.svelte';
  import type { InputField } from './input.svelte.ts';

  let { field }: { field: InputField<T> } = $props();

  let property = $derived(field.property);
</script>

InputField
<Container {property}>
  <Color value={field.value} onInput={field.onInput} />
</Container>
