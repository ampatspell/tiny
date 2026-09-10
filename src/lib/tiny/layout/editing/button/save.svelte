<script lang="ts" generics="M extends Model">
  import Busy from '#lib/tiny/button/specific/busy.svelte';
  import type { EditingLayout, Model } from '../layout.svelte.ts';

  let { layout }: { layout: EditingLayout<M> } = $props();

  let model = $derived(layout.model);
  let isSaving = $state(false);

  let onClick = async () => {
    try {
      isSaving = true;
      await model.save();
    } finally {
      isSaving = false;
    }
  };

  let onkeydown = (e: KeyboardEvent) => {
    if (model.isDirty) {
      if (e.key === 'Enter' && e.metaKey === true) {
        onClick();
      }
    }
  };
</script>

<svelte:document {onkeydown} />

{#if model.isDirty || isSaving}
  <Busy label="Save" {onClick} />
{/if}
