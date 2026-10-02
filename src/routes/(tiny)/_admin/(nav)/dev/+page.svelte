<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import { useFiles } from '#lib/tiny/files.svelte.js';
  import { images } from '#lib/tiny/utils/utils.js';
  import { resolve } from '$app/paths';

  let files = useFiles();
  let id = $state<string>();
  let onUpload = async () => {
    let file = await files.pick.file({ accept: images });
    if (file) {
      let body = file.file;
      let res = await fetch(resolve('/files'), {
        method: 'POST',
        body,
        headers: { name: file.name },
      });
      let json = await res.json();
      console.log(json);
      id = json.id;
    }
  };
</script>

<div class="page">
  <Button label="Upload" onClick={onUpload} />
  {#if id}
    <!-- svelte-ignore a11y_missing_attribute -->
    <img src={files.resolve({ id, variant: '1024x1024' })} />
  {/if}
</div>

<style lang="scss">
  .page {
    padding: 10px;
  }
</style>
