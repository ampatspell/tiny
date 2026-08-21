<script lang="ts">
  import type { DynamicOneEntity } from '$lib/dynamic/dynamic.svelte.js';

  let { entity, id }: { entity: DynamicOneEntity; id: string } = $props();
</script>
