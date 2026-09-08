<script lang="ts">
  import Color from '../color.svelte';
  import type { ColorField } from './color-field.svelte.ts';
  import Container from './container.svelte';

  let { field }: { field: ColorField } = $props();

  let value = $derived(field.value);
  let onInput = $derived(field.onInput);
</script>

<Container {field}>
  <Color {value} {onInput} />
</Container>
