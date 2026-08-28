<script lang="ts" generics="T">
  import Color from '$lib/tiny/color.svelte';
  import Container from '../container.svelte';
  import type { InputEditor } from './input.svelte.ts';

  let { field }: { field: InputEditor<T> } = $props();

  let property = $derived(field.property);
</script>

<Container {property}>
  <Color value={field.value} onInput={field.onInput} />
</Container>
