<script lang="ts">
  import Editor from '$lib/playground/index/editor.svelte';
  import Index from '$lib/playground/index/index.svelte';
</script>

<div class="page">
  <div class="editor">
    <Editor />
  </div>
  <div class="render">
    <Index />
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .editor {
      padding: 15px;
    }
    > .render {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
</style>
