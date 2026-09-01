<script lang="ts">
  import Container from '../container.svelte';
  import File from '#lib/tiny/file/file.svelte';
  import type { LocalFile } from '#lib/tiny/utils/files.svelte.js';
  import type { FileField } from './field.svelte.ts';

  let { field }: { field: FileField } = $props();

  let property = $derived(field.property);
  let accept = $derived(field.accept);
  let file = $derived(property.value);
  let onSelected = (next: LocalFile | undefined) => property.update(next);
</script>

<Container {field}>
  <File {file} {onSelected} {accept} />
</Container>
