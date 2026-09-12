<script lang="ts" generics="I extends ItemData">
  import Container from '../container.svelte';
  import BasicDropdown from '../../dropdown/basic/dropdown.svelte';
  import type { DropdownField } from './dropdown.svelte.ts';
  import type { ItemData } from '#lib/tiny/dropdown/basic/items.svelte';

  let { field }: { field: DropdownField<I> } = $props();
  let items = $derived(field.items);
  let selected = $derived(field.selected);
  let onSelect = $derived(field.onSelect);
  let isRequired = $derived(field.isRequired);
</script>

<Container {field}>
  <BasicDropdown {items} {selected} {onSelect} {isRequired} />
</Container>
