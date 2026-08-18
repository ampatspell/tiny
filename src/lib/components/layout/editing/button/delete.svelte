<script lang="ts">
  import TablerTrashX from '$lib/playground/icons/tabler--trash-x.svelte';
  import Light from './light.svelte';

  let { onDelete }: { onDelete: (reference: HTMLElement) => Promise<void> } = $props();
</script>

<Light label="Delete" icon={TablerTrashX} onClick={onDelete} />
