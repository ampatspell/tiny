<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Card from '#lib/tiny/card.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import Fields from './fields.svelte';
  import { useGalleryModel } from './gallery.svelte.ts';

  let { onDone }: { onDone: (id: string | undefined) => void } = $props();

  let model = useGalleryModel({
    isNew: true,
    data: { name: '', permalink: '', files: [] },
  });

  let onSubmit = async () => {
    let id = await model.save();
    if (id) {
      onDone(id);
    }
  };

  let onCancel = () => {
    console.log('cancel');
    onDone(undefined);
  };
</script>

<Card>
  <Form {onSubmit}>
    <Header title="New gallery" />
    <Fields {model} />
    <Actions>
      <Button label="Cancel" onClick={onCancel} />
      <Button type="submit" label="Add" />
    </Actions>
  </Form>
</Card>
