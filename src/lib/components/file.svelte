<script lang="ts">
  import Icon from '$lib/components/icon.svelte';
  import { pickFile, type LocalFile, type UniversalFile } from '$lib/utils/files.svelte.js';
  import { formatBytes, px, url } from '$lib/utils/utils.js';
  import TablerPhoto from '../playground/icons/tabler--photo.svelte';

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
    onSelected(file);
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="file" style:--height={px(height)} bind:clientWidth {onclick}>
  {#if file}
    <div class="content">
      {#if file.isImage}
        <div class="image">
          <div class="content" style:--url={url(file.url)}></div>
        </div>
      {/if}
      <div class="legend">
        <div class="caption">{file.name} ({formatBytes(file.size)})</div>
      </div>
    </div>
  {:else}
    <div class="blank">
      <div class="content">
        <Icon icon={TablerPhoto} size="medium" />
        <div class="label">Select a file</div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .file {
    user-select: none;
    width: 100%;
    border: 1px solid var(--dark-border-color-1);
    border-radius: 3px;
    overflow: hidden;
    height: var(--height);
    display: flex;
    flex-direction: column;
    font-size: var(--dark-font-size-small);
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      > .image {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 15px;
        > .content {
          flex: 1;
          background: var(--url);
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
      }
      > .legend {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(1px);
        gap: 5px;
        transition: 0.15s ease-in-out opacity;
        min-width: 0;
        > .caption {
          padding: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
    > .blank {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }
    }
  }
</style>
