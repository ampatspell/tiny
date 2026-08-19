<script lang="ts" generics="M extends Model, P extends Properties">
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { confirm } from '$lib/components/floating/layout/confirmation.svelte';
  import TablerCircleX from '$lib/playground/icons/tabler--circle-x.svelte';
  import type { EditingLayout, Model, Properties } from '../editing.svelte.ts';
  import Light from './light.svelte';

  let {
    layout,
  }: {
    layout: EditingLayout<M, P>;
  } = $props();

  let floaters = useFloaters();
  let properties = $derived(layout.properties);
  let onClick = async (reference: HTMLElement) => {
    let ok = await confirm({
      floaters,
      reference,
      title: 'Discard?',
      description: 'Sure you want discard all your changes?',
      confirm: 'Discard',
    });
    if (ok) {
      properties.rollback();
    }
  };
</script>

{#if properties.isDirty}
  <Light label="Discard all changes" icon={TablerCircleX} {onClick} />
{/if}
