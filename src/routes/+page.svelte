<script lang="ts">
  import Icon from '$lib/components/icon.svelte';
  import LucideCat from '$lib/playground/icons/lucide--cat.svelte';
</script>

<div class="page">
  <div class="content">
    <Icon icon={LucideCat} />
    <div class="label">Tiny playground</div>
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      > .label {
        font-size: var(--dark-font-size-small);
      }
    }
  }
</style>
