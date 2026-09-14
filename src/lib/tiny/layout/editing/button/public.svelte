<script lang="ts" generics=" P extends Model">
  import type { EditingLayout, Model } from '../layout.svelte.ts';
  import PublicButton from '#lib/tiny/button/specific/public.svelte';

  let {
    layout,
  }: {
    layout: EditingLayout<P>;
  } = $props();

  let route = $derived(layout.frontend);
</script>

<PublicButton {route} />
