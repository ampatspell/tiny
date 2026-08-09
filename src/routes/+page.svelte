<script lang="ts">
  import { getUid } from '#lib/random.remote';

  let uid = $derived(await getUid());
</script>

<div class="page">
  <div class="row">{uid.uid}</div>
</div>

<style lang="scss">
  .page {
    padding: 50px;
  }
</style>
