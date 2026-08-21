<script module lang="ts">
</script>

<script lang="ts">
  import { useDynamic } from './dynamic.svelte.ts';
  import Page from '$lib/components/page/page.svelte';
  import List from '$lib/components/list/list.svelte';
  import Item from '$lib/components/list/item/item.svelte';
  import Label from '$lib/components/list/item/label.svelte';
  import { resolve } from '$app/paths';
  import Icon from '$lib/components/icon.svelte';

  let dynamic = useDynamic();
</script>

<Page label="Dynamic">
  <List>
    {#each dynamic.entities as entity (entity.id)}
      <Item route={resolve('/_admin/dynamic/[entity]', { entity: entity.id })}>
        <Icon icon={entity.icon} />
        <Label label={entity.name} />
      </Item>
    {/each}
  </List>
</Page>
