<script lang="ts">
  import Icon from '$lib/components/icon.svelte';
  import TablerFileText from '$lib/playground/icons/tabler--file-text.svelte';
</script>

<div class="page">
  <Icon icon={TablerFileText} />
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
