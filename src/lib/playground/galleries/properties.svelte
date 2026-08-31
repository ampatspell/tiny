<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import type { GalleryProperties } from './gallery.svelte.ts';

  let { properties }: { properties: GalleryProperties } = $props();
  let { name, permalink } = $derived(properties);
</script>

<Content>
  <Fields field={name} />
  <Fields field={permalink} />
</Content>
