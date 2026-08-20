<script module lang="ts">
</script>

<script lang="ts">
  import TablerPhoto from '$lib/playground/icons/tabler--photo.svelte';

  import Icon from '../icon.svelte';
</script>

<div class="blank">
  <div class="content">
    <Icon icon={TablerPhoto} size="medium" />
    <div class="label">Select a file</div>
  </div>
</div>

<style lang="scss">
  .blank {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
  }
</style>
