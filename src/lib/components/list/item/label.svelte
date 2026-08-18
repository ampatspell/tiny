<script lang="ts">
  let { label, description }: { label: string; description?: string } = $props();
</script>

<div class="label">
  <div class="value">{label}</div>
  {#if description}
    <div class="description">{description}</div>
  {/if}
</div>

<style lang="scss">
  .label {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--dark-font-size-small);
    gap: 1px;
    min-width: 0;
    > .value {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
