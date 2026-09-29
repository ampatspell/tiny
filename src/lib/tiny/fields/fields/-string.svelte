<script lang="ts">
  import { useBusy } from '#lib/tiny/busy.svelte.js';
  import Input from '#lib/tiny/input.svelte';
  import Container from '../container.svelte';
  import type { StringField } from './string.svelte.ts';

  let { field }: { field: StringField } = $props();

  let busy = useBusy();

  let type = $derived(field.type);
  let rows = $derived(field.rows);
  let value = $derived(field.value);
  let autofocus = $derived(field.autofocus);
  let autocomplete = $derived(field.autocomplete);
  let onInput = $derived(field.onInput);
  let isBusy = $derived(busy.isBusy);
</script>

<Container {field}>
  <Input {type} {rows} {value} {onInput} {autofocus} {autocomplete} {isBusy} />
</Container>
