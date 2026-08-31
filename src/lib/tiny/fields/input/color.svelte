<script lang="ts" generics="T">
  import TinyColor from '#lib/tiny/color.svelte';
  import Container from '../container.svelte';
  import type { InputField } from './field.svelte.ts';

  let { field }: { field: InputField<T> } = $props();
</script>

<Container {field}>
  <TinyColor value={field.value} onInput={field.onInput} />
</Container>
