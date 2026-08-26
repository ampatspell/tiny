<script lang="ts">
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';
  import type { UniversalFile } from '../utils/files.svelte.ts';
  import { formatBytes } from '../utils/number.ts';
  import Overlay from './overlay.svelte';

  let {
    file,
  }: {
    file: UniversalFile;
  } = $props();

  let hover = $derived(file.isImage);
  let label = $derived(`${file.name} (${formatBytes(file.size)})`);
  let icon = TablerPhoto;
</script>

<Overlay {icon} {label} {hover} />
