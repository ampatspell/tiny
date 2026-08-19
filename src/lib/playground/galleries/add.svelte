<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Card from '$lib/components/card.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Header from '$lib/components/form/header.svelte';
  import Actions from '$lib/components/form/actions.svelte';
  import { useGalleryProperties } from './gallery.svelte.ts';
  import Busy from '$lib/components/button/specific/busy.svelte';
  import Properties from './properties.svelte';

  let { onDone }: { onDone: (id: string | undefined) => void } = $props();

  let properties = useGalleryProperties({
    isNew: true,
    data: { name: '', permalink: '' },
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
    <Properties {properties} />
    <Actions>
      <Button label="Cancel" onClick={onCancel} />
      <Busy label="Add" onClick={onSave} />
    </Actions>
  </Form>
</Card>
