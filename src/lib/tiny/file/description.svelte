<script lang="ts">
  import TablerPhoto from '$lib/tiny/icons/tabler--photo.svelte';
  import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
  import { formatBytes } from '$lib/tiny/utils/utils.js';
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
