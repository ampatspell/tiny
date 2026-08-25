<script lang="ts">
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import { useEditingLayout } from '$lib/components/layout/editing/editing.svelte.js';
  import Section from '$lib/components/page/section.svelte';
  import { getIndex } from '$lib/playground/index/index.remote.js';
  import { useIndexProperties } from '$lib/playground/index/index.svelte.js';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import Form from '$lib/playground/index/form.svelte';
  import { getter } from '$lib/tiny/utils/options.svelte.js';

  usePropertiesContext();
  let data = $derived(await getIndex());
  let properties = useIndexProperties({ data: getter(() => data) });

  let layout = useEditingLayout({
    title: getter(() => data.title ?? 'Index'),
    properties,
  });
</script>

<Editing {layout}>
  <Section>
    <Form {properties} />
  </Section>
</Editing>
