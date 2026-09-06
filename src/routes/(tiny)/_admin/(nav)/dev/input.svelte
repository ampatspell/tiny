<script lang="ts" generics="T">
  import Container from './container.svelte';
  import type { Data } from './index.svelte.ts';
  import type { InputField } from './input.svelte.ts';
  import Input from '#lib/tiny/input.svelte';

  let { field }: { field: InputField<Data, T> } = $props();
  let value = $derived(field.string);
  let onInput = $derived(field.onInput);
</script>

<Container {field}>
  <Input {value} {onInput} />
</Container>
