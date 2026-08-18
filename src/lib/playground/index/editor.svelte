<script lang="ts">
  import Files from '$lib/components/files.svelte';
  import Input from '$lib/components/input.svelte';
  import { getIndex, updateIndex, updateIndexFile } from './index.remote.js';
  import { usePropertiesContext } from '$lib/properties/context.svelte.js';
  import { useDataProperties, type DataProperty } from '$lib/properties/data.svelte.js';
  import BusyButton from '../busy-button.svelte';
  import { run } from '$lib/utils/utils.js';
  import { getter } from '$lib/utils/options.js';

  usePropertiesContext();
  let index = $derived(await getIndex());
  let props = useDataProperties({ data: getter(() => index) });

  let title = props.property('title');
  let description = props.property('description');

  let file = $state<File>();
  let onFiles = (files: File[]) => {
    file = files[0];
  };

  let onSave = async () => {
    await Promise.all([
      run(async () => {
        let data = props.dirty;
        if (data) {
          await updateIndex(data);
        }
      }),
      run(async () => {
        if (file) {
          await updateIndexFile({ file });
          file = undefined;
        }
      }),
    ]);
  };
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
{#snippet input(prop: DataProperty<any, string>)}
  <div class="row">
    <div class="label">{prop.key}</div>
    <div class="input">
      <Input value={prop.value} onInput={prop.update} />
    </div>
  </div>
{/snippet}

<div class="editor">
  {@render input(title)}
  {@render input(description)}
  <div class="row">
    <Files isMultiple={false} {onFiles} />
  </div>
  <div class="row">
    <BusyButton label="Save" onClick={onSave} />
  </div>
</div>

<style lang="scss">
  .editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-width: 300px;
      > .label {
        font-size: var(--dark-font-size-small);
      }
    }
  }
</style>
