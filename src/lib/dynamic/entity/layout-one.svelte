<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DynamicOneEntity } from '../dynamic.svelte.ts';

  let {
    entity,
    children,
  }: {
    entity: DynamicOneEntity;
    children: Snippet;
  } = $props();
</script>

{@render children()}
