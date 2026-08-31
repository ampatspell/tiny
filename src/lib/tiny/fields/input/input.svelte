<script lang="ts" generics="T">
  import TinyInput from '#lib/tiny/input.svelte';
  import Container from '../container.svelte';
  import type { InputField } from './field.svelte.ts';

  let { field }: { field: InputField<T> } = $props();
</script>

<Container {field}>
  <TinyInput value={field.value} onInput={field.onInput} onBlur={field.onBlur} type={field.type} />
</Container>
