<script lang="ts" generics="M extends Model, P extends Properties">
  import BusyButton from '$lib/playground/busy-button.svelte';
  import type { EditingLayout, Model, Properties } from '../editing.svelte.ts';

  let {
    layout,
  }: {
    layout: EditingLayout<M, P>;
  } = $props();

  let properties = $derived(layout.properties);
  let onClick = () => properties.save();
</script>

{#if properties.isDirty}
  <BusyButton label="Save" {onClick} />
{/if}
