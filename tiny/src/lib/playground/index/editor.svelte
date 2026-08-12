<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Files from '$lib/components/files.svelte';
  import Input from '$lib/components/input.svelte';
  import { getIndex, updateIndex, updateIndexFile } from '$lib/playground/index/index.remote.js';
  import { run } from '$lib/utils.js';

  let index = $derived(await getIndex());
  let file = $state<File>();
  let onFiles = (files: File[]) => {
    file = files[0];
  };

  let onSave = async () => {
    await Promise.all([
      updateIndex({ title: index.title }),
      run(async () => {
        if (file) {
          await updateIndexFile({ file });
        }
      }),
    ]);
  };
</script>

<div class="editor">
  <div class="row">
    <Input value={index.title} onInput={(value) => (index.title = value)} />
  </div>
  <div class="row">
    <Files isMultiple={false} {onFiles} />
  </div>
  <div class="row">
    <Button label="Save" onClick={onSave} />
  </div>
</div>

<style lang="scss">
  .editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      flex-direction: row;
      gap: 10px;
      max-width: 300px;
    }
  }
</style>
