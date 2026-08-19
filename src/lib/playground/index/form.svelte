<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/components/form/form.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Input from '$lib/components/properties/input.svelte';
  import File from '$lib/components/file.svelte';
  import type { LocalFile, UniversalFile } from '$lib/utils/files.svelte.js';

  let { properties }: { properties: IndexProperties } = $props();

  let title = $derived(properties.title);
  let description = $derived(properties.description);

  let file = $state<UniversalFile>();
  let onSelected = (next: LocalFile | undefined) => (file = next);
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
      <File {file} {onSelected} />
    </Row>
  </Content>
</Form>
