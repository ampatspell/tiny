<script lang="ts">
  import type { InputField } from './input.svelte.ts';
  import Input from '#lib/tiny/input.svelte';
  import type { Data } from '../index.svelte.ts';
  import Container from '../container.svelte';
  import type { Any } from '#lib/tiny/utils/utils.js';

  let { field }: { field: InputField<Data, Any> } = $props();
  let type = $derived(field.type);
  let value = $derived(field.string);
  let onInput = $derived(field.onInput);
  let onBlur = $derived(field.onBlur);
</script>

<Container {field}>
  <Input {value} {onInput} {onBlur} {type} />
</Container>
