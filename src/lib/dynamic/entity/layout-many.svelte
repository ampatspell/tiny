<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DynamicManyEntity } from '../dynamic.svelte.ts';

  let {
    entity,
    children,
  }: {
    entity: DynamicManyEntity;
    children: Snippet;
  } = $props();
</script>

{@render children()}
