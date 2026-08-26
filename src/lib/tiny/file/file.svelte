<script lang="ts">
  import { pickFile, type LocalFile, type UniversalFile } from '../utils/files.svelte.ts';
  import { px } from '../utils/style.ts';
  import Blank from './blank.svelte';
  import Content from './content.svelte';

  let {
    accept = [],
    file,
    onSelected,
  }: {
    accept?: string[];
    file: UniversalFile | undefined;
    onSelected: (model: LocalFile | undefined) => void;
  } = $props();

  let clientWidth = $state<number>();
  let height = $derived(((clientWidth ?? 0) / 3) * 2);

  let onclick = async () => {
    let file = await pickFile({ accept });
    if (file) {
      onSelected(file);
    }
  };

  let onDelete = () => {
    onSelected(undefined);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="file" style:--height={px(height)} bind:clientWidth {onclick}>
  {#if file}
    <Content {file} {onDelete} />
  {:else}
    <Blank />
  {/if}
</div>

<style lang="scss">
  .file {
    user-select: none;
    width: 100%;
    border: 1px solid var(--tiny-border-color-1);
    border-radius: 3px;
    overflow: hidden;
    height: var(--height);
    display: flex;
    flex-direction: column;
    font-size: var(--tiny-font-size-small);
    position: relative;
  }
</style>
