<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import { getter } from '$lib/tiny/utils/options.svelte.js';
  import EditorInput from '$lib/tiny/properties/editors/input.svelte';
  import { images } from '$lib/tiny/utils/utils.js';
  import Input from '$lib/tiny/properties/input.svelte';
  import File from '$lib/tiny/properties/file.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Color from '$lib/tiny/properties/color.svelte';
  import { useNumberEditor } from '$lib/tiny/properties/editors/number.svelte.js';

  let { properties }: { properties: IndexProperties } = $props();
  let backgroundOffset = useNumberEditor({ property: getter(() => properties.backgroundOffset) });
</script>

<Form size="regular">
  <Content>
    <Row>
      <Input property={properties.title} />
    </Row>
    <Row>
      <Input property={properties.description} />
    </Row>
    <Row>
      <File property={properties.background} accept={images} />
    </Row>
    <Row>
      <EditorInput editor={backgroundOffset} />
    </Row>
    <Row>
      <Color property={properties.indexBackgroundColor} />
      <Color property={properties.indexTextColor} />
    </Row>
    <Row>
      <Color property={properties.backgroundColor} />
      <Color property={properties.textColor} />
    </Row>
  </Content>
</Form>
