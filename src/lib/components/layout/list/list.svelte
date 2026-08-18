<script lang="ts">
  import type { ResolvedPathname } from '$app/types';
  import type { Snippet } from 'svelte';
  import Header from '../../header/header.svelte';
  import Title from '../../header/title.svelte';
  import List from '../../list/list.svelte';
  import Add from './add.svelte';

  let {
    route,
    title,
    onAdd,
    children,
  }: {
    route: ResolvedPathname;
    title: string;
    onAdd: (reference: HTMLElement) => void;
    children: Snippet;
  } = $props();
</script>

<List {route}>
  {#snippet header()}
    <Header>
      <Title label={title} />
      {#snippet accessories()}
        <Add {onAdd} />
      {/snippet}
    </Header>
  {/snippet}
  {@render children()}
</List>
