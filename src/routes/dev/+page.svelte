<script lang="ts">
  import Form from '$lib/components/form/form.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import File from '$lib/components/file.svelte';
  import { createOptionalRemoteFile, type LocalFile, type UniversalFile } from '$lib/utils/files.svelte.js';
  import { getIndex } from '$lib/playground/index/index.remote.js';

  let index = $derived(await getIndex());

  // svelte-ignore state_referenced_locally
  let bg = createOptionalRemoteFile(index.background);
  let model = $state<UniversalFile | undefined>(bg);
  let onSelected = (next: LocalFile | undefined) => {
    model = next;
  };
</script>

<Form size="regular">
  <Content>
    <Row>
      <File file={model} {onSelected} />
    </Row>
  </Content>
</Form>
