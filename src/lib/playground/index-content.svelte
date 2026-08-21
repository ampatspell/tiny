<script lang="ts">
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import { useEditingLayout } from '$lib/components/layout/editing/editing.svelte.js';
  import Section from '$lib/components/page/section.svelte';
  import File from '$lib/components/properties/file.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { optionalIntegerToString, toOptional } from '$lib/properties/transform.svelte.js';
  import { images } from '$lib/utils/files.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import { getIndex } from './index/index.remote.ts';
  import { useIndexProperties } from './index/index.svelte.ts';

  usePropertiesContext();
  let data = $derived(await getIndex());
  let properties = useIndexProperties({ data: getter(() => data) });

  let layout = useEditingLayout({
    title: getter(() => data.title ?? 'Index'),
    properties,
  });

  let title = $derived(properties.title);
  let description = $derived(properties.description);
  let background = $derived(properties.background);
  let backgroundOffset = $derived(optionalIntegerToString(toOptional(properties.backgroundOffset, 0)));
</script>

<Editing {layout}>
  <Section>
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
  </Section>
</Editing>
