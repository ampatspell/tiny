<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<div class="title">{label}</div>

<style lang="scss">
  .title {
    font-weight: 600;
  }
</style>
