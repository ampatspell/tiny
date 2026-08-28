<script lang="ts" generics="P extends Properties">
  import { useFloaters } from '$lib/tiny/floating/floaters/model.svelte.js';
  import { confirm } from '$lib/tiny/floating/layout/confirmation.svelte';
  import TablerCircleX from '$lib/tiny/icons/tabler--circle-x.svelte';
  import type { EditingLayout, Properties } from '../layout.svelte.ts';
  import Light from './light.svelte';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
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
