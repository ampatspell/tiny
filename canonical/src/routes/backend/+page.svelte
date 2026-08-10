<script lang="ts">
  import Icon from '#lib/cave/components/icon.svelte';
  import LucideCat from '#lib/icons/lucide--cat.svelte';
</script>

<div class="page">
  <Icon icon={LucideCat} />
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
