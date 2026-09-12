<script module lang="ts">
  import type { ItemState } from '#lib/tiny/dropdown/content/item/item.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import type { ComputePositionConfig } from '@floating-ui/dom';
  import type { Component } from 'svelte';
  import type { Floaters } from '../floaters/model.svelte.ts';
  import { basic } from '../position.ts';
  import Content from '#lib/tiny/dropdown/basic/content.svelte';

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
  <Content items={request.items} selected={undefined} onSelect={resolve} />
{/snippet}
