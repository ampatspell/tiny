<script lang="ts">
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Input from '$lib/tiny/properties/input.svelte';
  import type { GalleryProperties } from './gallery.svelte.ts';

  let { properties }: { properties: GalleryProperties } = $props();
  let { name, permalink } = $derived(properties);
</script>

<Content>
  <Row>
    <Input property={name} />
  </Row>
  <Row>
    <Input property={permalink} />
  </Row>
</Content>
