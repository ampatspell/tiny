<script lang="ts" generics="T">
  import Color from '$lib/tiny/color.svelte';
  import Container from './container.svelte';
  import type { InputField } from './input.svelte.ts';

  let { field }: { field: InputField<T> } = $props();
</script>

<Container {field}>
  <Color value={field.value} onInput={field.onInput} />
</Container>
