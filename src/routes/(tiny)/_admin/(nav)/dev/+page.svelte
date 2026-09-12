<script lang="ts">
  import Dropdown from '#lib/tiny/dropdown/basic/dropdown.svelte';
  import type { ItemData } from '#lib/tiny/dropdown/basic/items.svelte';

  type Model = {
    id: string;
    label: string;
  } & ItemData;

  let items = $state<Model[]>([
    {
      id: 'one',
      label: 'Duck',
    },
    {
      id: 'two',
      label: 'Hamster',
    },
    {
      id: 'three',
      label: 'Zeeba',
      state: 'critical',
    },
  ]);
  let selected = $state<Model | undefined>();
  let onSelect = (next: Model | undefined) => {
    selected = next;
  };
</script>

<div class="page">
  <Dropdown {items} {selected} isRequired={true} {onSelect} />
</div>

<style lang="scss">
  .page {
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
</style>
