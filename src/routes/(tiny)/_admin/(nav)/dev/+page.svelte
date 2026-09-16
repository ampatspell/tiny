<script lang="ts">
  import { createFileDropModel, fileDrop } from '#lib/tiny/file-drop.svelte.js';
  import { images } from '#lib/tiny/utils/utils.js';

  let model = createFileDropModel({
    accept: images,
    multiple: true,
    onDrop: (files) => {
      console.log('onDrop', files);
    },
  });

  $effect(() => console.log(model.isOver));
</script>

<div class="page">
  <div class="block" {@attach fileDrop(model)}></div>
</div>

<style lang="scss">
  .page {
    padding: 10px;
    > .block {
      width: 100px;
      height: 100px;
      border: 1px solid #000;
      border-radius: 4px;
    }
  }
</style>
