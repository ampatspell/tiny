<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import type { GalleryModel } from './gallery.svelte.ts';

  let { properties }: { properties: GalleryModel } = $props();

  let onClick = () => {
    properties.addDemoFile();
  };
</script>

<Content>
  <Fields field={properties.name} />
  <Fields field={properties.permalink} />

  <!-- {#each properties.files.items as properties}
    <Fields field={properties.name} />
  {/each} -->

  <Row>
    <Button label="Add file" {onClick} />
  </Row>
</Content>
