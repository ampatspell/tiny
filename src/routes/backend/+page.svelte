<script lang="ts">
  import Button from '#lib/button.svelte';
  import Input from '#lib/input.svelte';
  import { getIndex, updateIndex } from '#lib/kysely/index.remote';
  import { resolve } from '$app/paths';

  let index = $derived(await getIndex());
  let onSave = async () => {
    await updateIndex({ title: index.title });
  };
</script>

<div class="page">
  <div class="row">{index.id} {index.title}</div>
  <div class="row">
    <Input value={index.title} onInput={(value) => (index.title = value)} />
    <Button label="Save" onClick={onSave} />
  </div>
  <div class="row"><a href={resolve('/')}>index</a></div>
</div>

<style lang="scss">
  .page {
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }
</style>
