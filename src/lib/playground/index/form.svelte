<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/components/form/form.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import File from '$lib/components/properties/file.svelte';
  import { images } from '$lib/utils/files.svelte.js';
  import { optionalIntegerToString, toOptional } from '$lib/properties/transform.svelte.js';

  let { properties }: { properties: IndexProperties } = $props();

  let title = $derived(properties.title);
  let description = $derived(properties.description);
  let background = $derived(properties.background);
  let backgroundOffset = $derived(optionalIntegerToString(toOptional(properties.backgroundOffset, 0)));
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
      <Input property={backgroundOffset} />
    </Row>
  </Content>
</Form>
