<script lang="ts">
  import File from '#lib/tiny/file/file.svelte';
  import type { LocalFile } from '#lib/tiny/files.svelte.js';
  import Container from '../container.svelte';
  import type { Data } from '../index.svelte.ts';
  import type { FileField } from './file.svelte.ts';

  let { field }: { field: FileField<Data> } = $props();
  let accept = $derived(field.accept);
  let file = $derived(field.value);
  let onSelected = (next: LocalFile | undefined) => field.update(next);
</script>

<Container {field}>
  <File {file} {onSelected} {accept} />
</Container>
