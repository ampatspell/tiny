<script lang="ts">
  import Field from '$lib/tiny/fields/field.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import type { GalleryProperties } from './gallery.svelte.ts';

  let { properties }: { properties: GalleryProperties } = $props();
  let { name, permalink } = $derived(properties);
</script>

<Content>
  <Row>
    <Field field={name} />
  </Row>
  <Row>
    <Field field={permalink} />
  </Row>
</Content>
