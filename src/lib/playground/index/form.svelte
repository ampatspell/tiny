<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/components/form/form.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Input from '$lib/components/properties/input.svelte';

  let { properties }: { properties: IndexProperties } = $props();

  let title = $derived(properties.title);
  let description = $derived(properties.description);
</script>

<Form>
  <Content>
    <Row>
      <Input property={title} />
    </Row>
    <Row>
      <Input property={description} />
    </Row>
  </Content>
</Form>
