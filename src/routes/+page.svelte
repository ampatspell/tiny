<script lang="ts">
  import { getIndex } from '#lib/index.remote';
  import { resolve } from '$app/paths';

  let index = $derived(await getIndex());
</script>

<div class="page">
  <div class="row">{index.id} {index.title}</div>
  <div class="row"><a href={resolve('/backend')}>backend</a></div>
</div>

<style lang="scss">
  .page {
    padding: 50px;
  }
</style>
