<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import type { GalleryModel } from './gallery.svelte.ts';

  let { model }: { model: GalleryModel } = $props();

  const fields = $derived(model.fields);

  let onClick = () => {
    model.addDemoFile();
  };
</script>

<Content>
  <Fields field={fields.name} />
  <Fields field={fields.permalink} />
  <Row>
    <Button label="Add file" {onClick} />
  </Row>
</Content>
