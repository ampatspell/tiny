<script lang="ts">
  let { label }: { label: string | undefined } = $props();
</script>

{#if label}
  <div class="title">{label}</div>
{/if}

<style lang="scss">
  .title {
    font-weight: 700;
  }
</style>
