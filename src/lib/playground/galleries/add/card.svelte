<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Card from '$lib/components/card.svelte';
  import Input from '$lib/components/input.svelte';
  import BusyButton from '$lib/playground/busy-button.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { useDataProperties } from '$lib/properties/data.svelte.js';
  import { addGallery } from '../galleries.remote.ts';
  import { slug } from '$lib/utils/string.js';

  let { onDone }: { onDone: (added: string | undefined) => void } = $props();

  usePropertiesContext();
  let properties = useDataProperties({ name: '', permalink: '' });
  let name = properties.property('name', {
    didUpdate: ({ after }) => permalink.update(slug(after, { replacement: '-' })),
  });
  let permalink = properties.property('permalink');

  let onSave = async () => {
    let data = properties.data;
    let id = await addGallery(data);
    onDone(id);
  };

  let onCancel = () => onDone(undefined);
</script>

<Card>
  <div class="form">
    <div class="header">
      <div class="title">Add new gallery</div>
    </div>
    <div class="content">
      <div class="row">
        <Input placeholder="Name" value={name.value} onInput={name.update} />
      </div>
      <div class="row">
        <Input placeholder="Permalink" value={permalink.value} onInput={permalink.update} />
      </div>
    </div>
    <div class="actions">
      <Button label="Cancel" onClick={onCancel} />
      <BusyButton label="Add" onClick={onSave} />
    </div>
  </div>
</Card>

<style lang="scss">
  .form {
    padding: 10px;
    width: 270px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    > .header {
      display: flex;
      flex-direction: row;
      padding: 2px 0 0 0;
      > .title {
        font-weight: 600;
      }
    }

    > .content {
      display: flex;
      flex-direction: column;
      gap: 5px;
      > .row {
        display: flex;
        flex-direction: row;
        gap: 5px;
      }
    }

    > .actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 5px;
    }
  }
</style>
