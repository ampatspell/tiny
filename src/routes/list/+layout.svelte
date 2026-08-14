<script lang="ts">
  import { resolve } from '$app/paths';
  import Header from '$lib/components/backend/header/header.svelte';
  import Title from '$lib/components/backend/header/title.svelte';
  import Item from '$lib/components/backend/list/item/item.svelte';
  import Label from '$lib/components/backend/list/item/label.svelte';
  import List from '$lib/components/backend/list/list.svelte';
  import Icon from '$lib/components/icon.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
  import TablerFileText from '$lib/playground/icons/tabler--file-text.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="page">
  <div class="sidebar">
    <List>
      {#snippet top()}
        <Header>
          <Title label="Galleries" />
        </Header>
      {/snippet}
      <Item route={resolve('/list/[id]', { id: 'inkblot' })}>
        <Label label="Inkblot" description="/inkblot" />
        <Icon icon={LucideCat} />
      </Item>
      <Item route={resolve('/list/[id]', { id: 'zine-2' })}>
        <Label label="Zine #2" description="/zine-2" />
        <Icon icon={TablerFileText} />
      </Item>
    </List>
  </div>
  <div class="detail">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: row;
    > .sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--dark-border-color-1);
    }
    > .detail {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
