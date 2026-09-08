<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import type { GalleryModel } from './gallery.svelte.ts';

  let { model }: { model: GalleryModel } = $props();

  const fields = $derived(model.fields);
</script>

<Content>
  <Fields field={fields.name} />
  <Fields field={fields.permalink} />
</Content>
