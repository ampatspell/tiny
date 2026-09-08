<script lang="ts">
  import File from '#lib/tiny/file/file.svelte';
  import Container from '../container.svelte';
  import type { FileField } from './file.svelte.ts';

  let { field }: { field: FileField } = $props();
  let accept = $derived(field.accept);
  let file = $derived(field.value);
  let onSelected = $derived(field.onSelected);
</script>

<Container {field}>
  <File {file} {onSelected} {accept} />
</Container>
