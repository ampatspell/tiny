<script lang="ts" generics="M extends Model">
  import Busy from '#lib/tiny/button/specific/busy.svelte';
  import type { EditingLayout, Model } from '../layout.svelte.ts';

  let { layout }: { layout: EditingLayout<M> } = $props();

  let onClick = () => layout.save();

  let onkeydown = async (e: KeyboardEvent) => {
    if (layout.isDirty) {
      if (e.key === 'Enter' && e.metaKey === true) {
        await onClick();
      }
    }
  };

  let isBusy = $derived(layout.isSaving);
</script>

<svelte:document {onkeydown} />

{#if layout.isDirty || isBusy}
  <Busy label="Save" {onClick} {isBusy} />
{/if}
