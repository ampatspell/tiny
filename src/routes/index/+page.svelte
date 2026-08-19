<script lang="ts">
  import Editing from '$lib/components/layout/editing/editing.svelte';
  import { useEditingLayout } from '$lib/components/layout/editing/editing.svelte.js';
  import Section from '$lib/components/layout/editing/section.svelte';
  import { getIndex } from '$lib/playground/index/index.remote.js';
  import Index from '$lib/playground/index/index.svelte';
  import { useIndexProperties } from '$lib/playground/index/index.svelte.js';
  import Screen from '$lib/components/screen.svelte';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { getter } from '$lib/utils/options.svelte.js';
  import Form from '$lib/playground/index/form.svelte';

  usePropertiesContext();
  let data = $derived(await getIndex());
  let properties = useIndexProperties({ data: getter(() => data) });

  let layout = useEditingLayout({
    title: getter(() => data.title ?? 'Index'),
    properties,
    data: getter(() => data),
  });
</script>

<Editing {layout}>
  <Section>
    <Form {properties} />
  </Section>
  <Section height="fill">
    <div class="screen">
      <Screen>
        <Index />
      </Screen>
    </div>
  </Section>
</Editing>

<style lang="scss">
  .screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
</style>
