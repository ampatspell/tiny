<script lang="ts">
  import Screen from '$lib/components/screen.svelte';
  import Index from '$lib/playground/index/index.svelte';
</script>

<div class="page">
  <Screen>
    <Index />
  </Screen>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
