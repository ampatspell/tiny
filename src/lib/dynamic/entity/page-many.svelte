<script lang="ts">
  import Placeholder from '$lib/components/placeholder.svelte';
  import type { DynamicManyEntity } from '../dynamic.svelte.ts';

  let { entity }: { entity: DynamicManyEntity } = $props();

  let icon = $derived(entity.icon);
  let label = $derived(entity.name);
</script>

<Placeholder {icon} {label} />
