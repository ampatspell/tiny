<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import { getter } from '$lib/tiny/utils/options.svelte.js';
  import Number, { useNumberPropertyEditor } from '$lib/tiny/properties/editors/number.svelte';
  import { images } from '$lib/tiny/utils/utils.js';
  import Input from '$lib/tiny/properties/input.svelte';
  import File from '$lib/tiny/properties/file.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';

  let { properties }: { properties: IndexProperties } = $props();

  let title = $derived(properties.title);
  let description = $derived(properties.description);
  let background = $derived(properties.background);
  let backgroundOffset = useNumberPropertyEditor({ property: getter(() => properties.backgroundOffset) });
</script>

<Form size="regular">
  <Content>
    <Row>
      <Input property={title} />
    </Row>
    <Row>
      <Input property={description} />
    </Row>
    <Row>
      <File property={background} accept={images} />
    </Row>
    <Row>
      <Number editor={backgroundOffset} />
    </Row>
  </Content>
</Form>
