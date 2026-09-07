<script lang="ts">
  import Color from '#lib/tiny/color.svelte';
  import Container from '../container.svelte';
  import type { Data } from '../index.svelte.ts';
  import type { ColorField } from './string.svelte.ts';

  let { field }: { field: ColorField<Data> } = $props();
</script>

<Container {field}>
  <Color value={field.value} onInput={field.onInput} />
</Container>
