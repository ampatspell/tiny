<script module lang="ts">
  import Card from '#lib/tiny/card.svelte';
  import type { Component } from 'svelte';
  import { basic } from '../position.ts';
  import Content from '#lib/tiny/dropdown/content/content.svelte';
  import Icon from '#lib/tiny/dropdown/content/item/icon.svelte';
  import Item, { type ItemState } from '#lib/tiny/dropdown/content/item/item.svelte';
  import Label from '#lib/tiny/dropdown/content/item/label.svelte';
  import type { ComputePositionConfig } from '@floating-ui/dom';
  import type { Floaters } from '../floaters/model.svelte.ts';
  import { getter } from '#lib/tiny/utils/options.svelte.js';

  export type DropdownItem = {
    icon?: Component;
    label: string;
    state?: ItemState;
  };

  export type DropdownOptions<I extends DropdownItem = DropdownItem> = {
    floaters: Floaters;
    reference: HTMLElement;
    items: I[];
    position?: ComputePositionConfig;
  };

  export const dropdown = async <I extends DropdownItem = DropdownItem>(opts: DropdownOptions<I>) => {
    return (await opts.floaters.open({
      snippet,
      request: opts as DropdownOptions,
      reference: getter(() => opts.reference),
      position: opts.position ?? basic(),
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
        <Item state={item.state} onClick={() => resolve(item)}>
          <Icon icon={item.icon} />
          <Label label={item.label} />
        </Item>
      {/each}
    </Content>
  </Card>
{/snippet}
