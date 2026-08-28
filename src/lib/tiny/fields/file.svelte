<script lang="ts">
  import Container from './container.svelte';
  import type { FileEditor } from './file.svelte.ts';
  import File from '$lib/tiny/file/file.svelte';
  import type { LocalFile } from '$lib/tiny/utils/files.svelte.js';

  let { field }: { field: FileEditor } = $props();

  let property = $derived(field.property);
  let accept = $derived(field.accept);
  let file = $derived(property.value);
  let onSelected = (next: LocalFile | undefined) => property.update(next);
</script>

<Container {field}>
  <File {file} {onSelected} {accept} />
</Container>
