<script lang="ts">
  import type { Property } from '$lib/properties/property.svelte.js';
  import type { LocalFile, UniversalFile } from '$lib/utils/files.svelte.js';
  import File from '$lib/components/file/file.svelte';
  import Container from './container.svelte';

  let { property }: { property: Property<UniversalFile | undefined> } = $props();
  let file = $derived(property.value);
  let onSelected = (next: LocalFile | undefined) => property.update(next);
</script>

<Container {property}>
  <File {file} {onSelected} />
</Container>
