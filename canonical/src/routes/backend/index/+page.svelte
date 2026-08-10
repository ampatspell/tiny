<script lang="ts">
  import Button from '#lib/cave/components/button.svelte';
  import Files from '#lib/cave/components/files.svelte';
  import Input from '#lib/cave/components/input.svelte';
  import { run } from '#lib/cave/utils';
  import { getIndex, updateIndex, updateIndexFile } from '#lib/index.remote';

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

<div class="page">
  <div class="row">{index.backgroundId}</div>
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
  .page {
    padding: 15px;
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
