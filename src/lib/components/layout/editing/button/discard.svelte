<script lang="ts">
  import TablerCircleX from '$lib/playground/icons/tabler--circle-x.svelte';
  import Light from './light.svelte';

  let { onDiscard }: { onDiscard: (reference: HTMLElement) => void } = $props();
</script>

<Light label="Discard all changes" icon={TablerCircleX} onClick={onDiscard} />
