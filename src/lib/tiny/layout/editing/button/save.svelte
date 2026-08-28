<script lang="ts" generics=" P extends Properties">
  import Busy from '$lib/tiny/button/specific/busy.svelte';
  import type { EditingLayout, Properties } from '../layout.svelte.ts';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
  } = $props();

  let properties = $derived(layout.properties);
  let onClick = () => properties.save();

  let onkeydown = (e: KeyboardEvent) => {
    if (properties.isDirty) {
      if (e.key === 'Enter' && e.metaKey === true) {
        onClick();
      }
    }
  };
</script>

<svelte:document {onkeydown} />

{#if properties.isDirty}
  <Busy label="Save" {onClick} />
{/if}
