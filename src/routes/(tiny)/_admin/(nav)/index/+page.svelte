<script lang="ts">
  import { getIndex } from '#lib/playground/index/index.remote.js';
  import { useIndexModel } from '#lib/playground/index/index.svelte.js';
  import Form from '#lib/playground/index/form.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';

  let data = $derived(await getIndex());
  let model = useIndexModel({ data: getter(() => data) });

  let layout = useEditingLayout({
    title: getter(() => data.title ?? 'Index'),
    model,
  });
</script>

<Editing {layout}>
  <Section>
    <Form properties={model} />
  </Section>
</Editing>
