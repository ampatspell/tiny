<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Card from '$lib/components/card.svelte';
  import BusyButton from '$lib/playground/busy-button.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { useDataProperties } from '$lib/properties/data.svelte.js';
  import { addGallery } from '../galleries.remote.ts';
  import { slug } from '$lib/utils/string.js';
  import Form from '$lib/components/form/form.svelte';
  import Header from '$lib/components/form/header.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Actions from '$lib/components/form/actions.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import { notBlank } from '$lib/properties/validator.svelte.js';

  let { onDone }: { onDone: (added: string | undefined) => void } = $props();

  const context = usePropertiesContext();
  let properties = useDataProperties({ name: '', permalink: '' });
  let name = properties.property('name', {
    didUpdate: ({ after }) => permalink.update(slug(after, { replacement: '-' })),
    validator: notBlank(),
  });
  let permalink = properties.property('permalink');

  let onSave = async () => {
    if (context.touch()) {
      let data = properties.data;
      let id = await addGallery(data);
      onDone(id);
    }
  };

  let onCancel = () => onDone(undefined);
</script>

<Card>
  <Form>
    <Header title="Add new gallery" />
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
      <BusyButton label="Add" onClick={onSave} />
    </Actions>
  </Form>
</Card>
