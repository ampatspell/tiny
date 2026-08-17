<script lang="ts">
  import Icon from '$lib/components/icon.svelte';
  import TablerCode from '$lib/playground/icons/tabler--code.svelte';
</script>

<div class="dev">
  <Icon icon={TablerCode} />
</div>

<style lang="scss">
  .dev {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
