<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DynamicOneEntity } from '../dynamic.svelte.ts';

  // eslint-disable-next-line svelte/no-unused-props
  let {
    children,
  }: {
    entity: DynamicOneEntity;
    children: Snippet;
  } = $props();
</script>

{@render children()}
