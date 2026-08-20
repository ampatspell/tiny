<script lang="ts" generics=" P extends Properties">
  import { goto } from '$app/navigation';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { confirm } from '$lib/components/floating/layout/confirmation.svelte';
  import TablerTrashX from '$lib/icons/tabler--trash-x.svelte';
  import type { EditingLayout, Properties } from '../editing.svelte.ts';
  import Light from './light.svelte';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
  } = $props();

  let floaters = useFloaters();
  let properties = $derived(layout.properties);
  let route = $derived(layout.route);

  let onClick = async (reference: HTMLElement) => {
    let ok = await confirm({
      floaters,
      reference,
      title: 'Delete?',
      description: 'Sure you want to delete it?',
      confirm: 'Delete',
    });
    if (ok) {
      await properties.destroy?.();
      goto(route, { replaceState: true });
    }
  };
</script>

{#if properties.destroy}
  <Light label="Delete" icon={TablerTrashX} {onClick} />
{/if}
