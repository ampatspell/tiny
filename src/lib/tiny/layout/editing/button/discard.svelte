<script lang="ts" generics="M extends Model">
  import { useFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { confirm } from '#lib/tiny/floating/layout/confirmation.svelte';
  import TablerCircleX from '#lib/tiny/icons/tabler--circle-x.svelte';
  import type { EditingLayout, Model } from '../layout.svelte.ts';
  import Light from './light.svelte';

  let { layout }: { layout: EditingLayout<M> } = $props();

  let floaters = useFloaters();
  let onClick = async (reference: HTMLElement) => {
    let ok = await confirm({
      floaters,
      reference,
      title: 'Discard?',
      description: 'Sure you want discard all your changes?',
      confirm: 'Discard',
    });
    if (ok) {
      layout.rollback();
    }
  };
</script>

{#if layout.isDirty}
  <Light label="Discard all changes" icon={TablerCircleX} {onClick} />
{/if}
