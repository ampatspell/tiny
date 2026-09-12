<script lang="ts">
  import { getAllUsers, type UserData } from '#lib/playground/users/users.remote.js';
  import { useListLayout } from '#lib/tiny/layout/list/layout.svelte.js';
  import List from '#lib/tiny/layout/list/list.svelte';
  import Label from '#lib/tiny/list/item/label.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  let id = $derived(page.params.id);
  let users = $derived(await getAllUsers());

  let layout = useListLayout({
    selected: getter(() => id),
    models: getter(() => users),
    item,
  });
</script>

{#snippet item(user: UserData)}
  <Label label={user.email} description={user.role} />
{/snippet}

<List {layout}>
  {@render children?.()}
</List>
