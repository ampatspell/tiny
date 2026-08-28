<script lang="ts">
  import Content from '$lib/tiny/form/content/content.svelte';
  import Field from '$lib/tiny/form/content/field.svelte';
  import type { GalleryProperties } from './gallery.svelte.ts';

  let { properties }: { properties: GalleryProperties } = $props();
  let { name, permalink } = $derived(properties);
</script>

<Content>
  <Field field={name} />
  <Field field={permalink} />
</Content>
