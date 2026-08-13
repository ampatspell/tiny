<script lang="ts">
  import Icon from '$lib/components/icon.svelte';
  import TablerBalloon from '$lib/playground/icons/tabler--balloon.svelte';
</script>

<div class="page">
  <div class="content">
    <Icon icon={TablerBalloon} />
    <div class="label">@floating-ui</div>
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
