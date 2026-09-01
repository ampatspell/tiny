<script lang="ts" generics="M extends Model">
  import { goto } from '$app/navigation';
  import { useFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { confirm } from '#lib/tiny/floating/layout/confirmation.svelte';
  import TablerTrashX from '#lib/tiny/icons/tabler--trash-x.svelte';
  import type { EditingLayout, Model } from '../layout.svelte.ts';
  import Light from './light.svelte';

  let { layout }: { layout: EditingLayout<M> } = $props();

  let floaters = useFloaters();
  let model = $derived(layout.model);
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
      await model.destroy?.();
      goto(route, { replaceState: true });
    }
  };
</script>

{#if model.destroy}
  <Light label="Delete" icon={TablerTrashX} {onClick} />
{/if}
