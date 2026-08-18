<script lang="ts">
  import Actions from '$lib/components/form/actions.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import BusyButton from '../busy-button.svelte';
  import type { GalleryData } from './galleries.remote.ts';
  import { useEditGalleryProperties } from './gallery.svelte.ts';

  let { gallery }: { gallery: GalleryData } = $props();
  let properties = useEditGalleryProperties({ data: () => gallery });
  let { name, permalink } = properties;

  let onSave = () => properties.save();
</script>

<Form>
  <Content>
    <Row>
      <Input property={name} />
    </Row>
    <Row>
      <Input property={permalink} />
    </Row>
  </Content>
  <Actions>
    <BusyButton label="Save" onClick={onSave} />
  </Actions>
</Form>
