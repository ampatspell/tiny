<script lang="ts">
  import Input from '../../input.svelte';
  import Container from '../container.svelte';
  import type { NumberField } from './number.svelte.ts';

  let { field }: { field: NumberField } = $props();

  let value = $derived(field.string);
  let onInput = $derived(field.onInput);
  let onBlur = $derived(field.onBlur);
</script>

<Container {field}>
  <Input {value} {onInput} {onBlur} />
</Container>
