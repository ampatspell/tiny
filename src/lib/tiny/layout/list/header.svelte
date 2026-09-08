<script lang="ts" generics="M extends Model">
  import TinyHeader from '../../header/header.svelte';
  import Title from '../../header/title.svelte';
  import Add from './add.svelte';
  import type { ListLayout, Model } from './layout.svelte.ts';

  let {
    layout,
  }: {
    layout: ListLayout<M>;
  } = $props();

  let title = $derived(layout.title);
</script>

<TinyHeader>
  <Title label={title} />
  {#snippet accessories()}
    <Add {layout} />
  {/snippet}
</TinyHeader>
