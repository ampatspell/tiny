<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/components/form/form.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import File from '$lib/components/properties/file.svelte';
  import { getter } from '$lib/utils/options.svelte.js';
  import Number, { useNumberPropertyEditor } from '$lib/components/properties/editors/number.svelte';
  import { images } from '$lib/utils/utils.js';

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
