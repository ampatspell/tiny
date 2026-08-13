<script lang="ts">
  import Input from '$lib/components/input.svelte';
  import BusyButton from '$lib/playground/busy-button.svelte';
  import { getIndex, updateIndex } from '$lib/playground/index/index.remote.js';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { useDataProperties } from '$lib/properties/data.svelte.js';

  let context = usePropertiesContext();
  let index = $derived(await getIndex());
  let props = useDataProperties(() => index);

  let title = props.property('title');
  let description = props.property('description');

  let onSave = async () => {
    let data = props.pack();
    await updateIndex(data);
  };
</script>

<div class="page">
  <div class="row"><Input value={title.value} onInput={(value) => title.update(value)} /></div>
  <div class="row"><Input value={description.value} onInput={(value) => description.update(value)} /></div>
  <div class="row">{title.isDirty}</div>
  <div class="row">isTouched={context.isTouched} isDirty={context.isDirty} isValid={context.touched.isValid}</div>
  <div class="row">
    <BusyButton label="Save" onClick={onSave} />
  </div>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
  }
</style>
