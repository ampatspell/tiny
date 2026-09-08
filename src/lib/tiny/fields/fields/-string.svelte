<script lang="ts">
  import Input from '#lib/tiny/input.svelte';
  import Container from '../container.svelte';
  import type { StringField } from './string.svelte.ts';

  let { field }: { field: StringField } = $props();

  let type = $derived(field.type);
  let value = $derived(field.value);
  let onInput = $derived(field.onInput);
</script>

<Container {field}>
  <Input {type} {value} {onInput} />
</Container>
