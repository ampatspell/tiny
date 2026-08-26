<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<div class="label">{label}</div>

<style lang="scss">
  .label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--tiny-font-size-medium);
  }
</style>
