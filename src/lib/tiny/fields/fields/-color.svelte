<script lang="ts">
  import TinyColor from '#lib/tiny/color.svelte';
  import Container from '../container.svelte';
  import type { ColorField } from './color.svelte.ts';

  let { field }: { field: ColorField } = $props();

  let value = $derived(field.value);
  let onInput = $derived(field.onInput);
</script>

<Container {field}>
  <TinyColor {value} {onInput} />
</Container>
