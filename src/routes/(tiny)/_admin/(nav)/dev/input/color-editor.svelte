<script lang="ts">
  import Color from '#lib/tiny/color.svelte';
  import Container from '../container.svelte';
  import type { StringField } from './string.svelte.ts';

  let { field }: { field: StringField } = $props();
</script>

<Container {field}>
  <Color value={field.value} onInput={field.onInput} />
</Container>
