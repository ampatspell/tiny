<script lang="ts">
  import type { Property } from '$lib/tiny/properties/property.svelte.js';
  import type { LocalFile, UniversalFile } from '$lib/tiny/utils/files.svelte.js';
  import Container from './container.svelte';
  import File from '$lib/tiny/file/file.svelte';

  let { property, accept }: { property: Property<UniversalFile | undefined>; accept?: string[] } = $props();
  let file = $derived(property.value);
  let onSelected = (next: LocalFile | undefined) => property.update(next);
</script>

<Container {property}>
  <File {file} {onSelected} {accept} />
</Container>
