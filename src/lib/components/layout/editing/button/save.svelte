<script lang="ts" generics=" P extends Properties">
  import Busy from '$lib/components/button/specific/busy.svelte';
  import type { EditingLayout, Properties } from '../editing.svelte.ts';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
  } = $props();

  let properties = $derived(layout.properties);
  let onClick = () => properties.save();
</script>

{#if properties.isDirty}
  <Busy label="Save" {onClick} />
{/if}
