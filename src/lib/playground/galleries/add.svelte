<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Card from '$lib/components/card.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Header from '$lib/components/form/header.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Actions from '$lib/components/form/actions.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import { useGalleryProperties } from './gallery.svelte.ts';
  import Busy from '$lib/components/button/specific/busy.svelte';

  let { onDone }: { onDone: (id: string | undefined) => void } = $props();

  let properties = useGalleryProperties({
    isNew: true,
    data: { name: '', permalink: '' },
  });

  let { name, permalink } = properties;

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
    <Content>
      <Row>
        <Input property={name} />
      </Row>
      <Row>
        <Input property={permalink} />
      </Row>
    </Content>
    <Actions>
      <Button label="Cancel" onClick={onCancel} />
      <Busy label="Add" onClick={onSave} />
    </Actions>
  </Form>
</Card>
