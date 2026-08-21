<script lang="ts">
  import type { DynamicOneEntity } from '../dynamic.svelte.ts';

  let { entity }: { entity: DynamicOneEntity } = $props();

  let Content = $derived(entity.content);
</script>

<Content />
