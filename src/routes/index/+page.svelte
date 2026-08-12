<script lang="ts">
  import Editor from '$lib/playground/index/editor.svelte';
  import Index from '$lib/playground/index/index.svelte';
  import Screen from '$lib/playground/screen.svelte';
</script>

<div class="page">
  <Editor />
  <Screen>
    <Index />
  </Screen>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
</style>
