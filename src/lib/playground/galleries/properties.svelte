<script lang="ts">
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import type { GalleryProperties } from './gallery.svelte.js';

  let { properties }: { properties: GalleryProperties } = $props();
  let { name, permalink } = $derived(properties);
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
</Form>
