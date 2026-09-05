<script lang="ts">
  import { useGalleryModel } from './gallery.svelte.ts';
  import Fields from './fields.svelte';
  import Card from '#lib/tiny/card.svelte';
  import Button from '#lib/tiny/button/button.svelte';
  import Busy from '#lib/tiny/button/specific/busy.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';

  let { onDone }: { onDone: (id: string | undefined) => void } = $props();

  let properties = useGalleryModel({
    isNew: true,
    data: { name: '', permalink: '', files: [] },
  });

  let onSave = async () => {
    let id = await properties.save();
    if (id) {
      onDone(id);
    }
  };

  let onCancel = () => onDone(undefined);
</script>

<Card>
  <Form>
    <Header title="New gallery" />
    <Fields {properties} />
    <Actions>
      <Button label="Cancel" onClick={onCancel} />
      <Busy label="Add" onClick={onSave} />
    </Actions>
  </Form>
</Card>
