<script lang="ts" generics="T">
  import Input from '$lib/tiny/input.svelte';
  import Container from './container.svelte';
  import type { InputField } from './input.svelte.ts';

  let { field }: { field: InputField<T> } = $props();

  let property = $derived(field.property);
  let type = $derived(field.type);
</script>

<Container {property}>
  <Input value={field.value} onInput={field.onInput} onBlur={field.onBlur} {type} />
</Container>
