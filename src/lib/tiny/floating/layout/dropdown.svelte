<script module lang="ts">
  import Card from '$lib/tiny/card.svelte';
  import type { Component } from 'svelte';
  import { basic } from '../position.ts';
  import type { Floaters } from '../floaters.svelte.ts';
  import Content from '$lib/tiny/dropdown/content/content.svelte';
  import Icon from '$lib/tiny/dropdown/content/item/icon.svelte';
  import Item from '$lib/tiny/dropdown/content/item/item.svelte';
  import Label from '$lib/tiny/dropdown/content/item/label.svelte';

  export type DropdownItem = {
    icon?: Component;
    label: string;
  };

  export type DropdownOptions<I extends DropdownItem = DropdownItem> = {
    floaters: Floaters;
    reference: HTMLElement;
    items: I[];
  };

  export const dropdown = async <I extends DropdownItem = DropdownItem>(opts: DropdownOptions<I>) => {
    return (await opts.floaters.open({
      snippet,
      request: opts as DropdownOptions,
      reference: () => opts.reference,
      position: basic(),
      close: null,
    }).response) as I | undefined;
  };
</script>

{#snippet snippet({
  request,
  resolve,
}: {
  request: DropdownOptions;
  resolve: (item: DropdownItem | undefined) => void;
})}
  <Card width="fit">
    <Content>
      {#each request.items as item (item.label)}
        <Item onClick={() => resolve(item)}>
          <Icon icon={item.icon} />
          <Label label={item.label} />
        </Item>
      {/each}
    </Content>
  </Card>
{/snippet}
