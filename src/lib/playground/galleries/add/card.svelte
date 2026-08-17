<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Card from '$lib/components/card.svelte';
  import Input from '$lib/components/input.svelte';
  import BusyButton from '$lib/playground/busy-button.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { useDataProperties } from '$lib/properties/data.svelte.js';
  import { addGallery } from '../galleries.remote.ts';

  let { onDone }: { onDone: (added: boolean) => void } = $props();

  usePropertiesContext();
  let properties = useDataProperties({ name: '', permalink: '' });
  let name = properties.property('name');
  let permalink = properties.property('permalink');

  let onSave = async () => {
    let data = properties.data;
    await addGallery(data);
    onDone(true);
  };
</script>

<Card>
  <div class="content">
    <div class="row title">Add new gallery</div>
    <div class="row">
      <Input placeholder="Name" value={name.value} onInput={name.update} />
    </div>
    <div class="row">
      <Input placeholder="Permalink" value={permalink.value} onInput={permalink.update} />
    </div>
    <div class="row actions">
      <Button label="Cancel" onClick={() => onDone(false)} />
      <BusyButton label="Add" onClick={onSave} />
    </div>
  </div>
</Card>

<style lang="scss">
  .content {
    padding: 10px;
    width: 270px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      &.actions {
        flex-direction: row;
        gap: 5px;
        justify-content: flex-end;
      }
    }
  }
</style>
