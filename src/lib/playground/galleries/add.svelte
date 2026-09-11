<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Busy from '#lib/tiny/button/specific/busy.svelte';
  import Card from '#lib/tiny/card.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import Fields from './fields.svelte';
  import { useGalleryModel } from './gallery.svelte.ts';

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
    <Fields model={properties} />
    <Actions>
      <Button label="Cancel" onClick={onCancel} />
      <Busy type="submit" label="Add" onClick={onSave} />
    </Actions>
  </Form>
</Card>
