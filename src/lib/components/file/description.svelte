<script lang="ts">
  import TablerPhoto from '$lib/icons/tabler--photo.svelte';
  import type { UniversalFile } from '$lib/utils/files.svelte.js';
  import { formatBytes } from '$lib/utils/utils.js';
  import Overlay from './overlay.svelte';

  let {
    file,
    onDelete,
  }: {
    file: UniversalFile;
    onDelete: () => void;
  } = $props();

  let hover = $derived(file.isImage);
  let label = $derived(`${file.name} (${formatBytes(file.size)})`);
  let icon = TablerPhoto;
</script>

<Overlay {icon} {label} {hover} {onDelete} />
