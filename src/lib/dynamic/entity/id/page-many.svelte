<script lang="ts">
  import type { DynamicManyEntity } from '$lib/dynamic/dynamic.svelte.js';

  let { entity, id }: { entity: DynamicManyEntity; id: string } = $props();
</script>
