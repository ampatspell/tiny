<script lang="ts">
  import type { UniversalFile } from '#lib/tiny/files.svelte.js';
  import Icon from '#lib/tiny/icon.svelte';
  import TablerBalloon from '#lib/tiny/icons/tabler--balloon.svelte';
  import { url } from '#lib/tiny/utils/style.js';
  import Item from './item.svelte';

  let {
    file,
    isSelected,
    isDeleted,
  }: {
    file: UniversalFile | undefined;
    isSelected: boolean;
    isDeleted?: boolean;
  } = $props();

  let image = $derived.by(() => {
    if (file?.isImage) {
      return file.variant.forSize({ width: 300, height: 300 })?.url;
    }
  });
</script>

<Item {isSelected}>
  {#if file}
    <div class={['file', isDeleted && 'deleted']}>
      <div class="preview">
        {#if image}
          <div class="thumbnail" style:--url={url(image)}></div>
        {:else}
          <Icon icon={TablerBalloon} />
        {/if}
      </div>
      <div class="details">{file.basename}</div>
    </div>
  {/if}
</Item>

<style lang="scss">
  .file {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: 0.15s ease-in-out opacity;
    > .preview {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--padding);
      > .thumbnail {
        width: 100%;
        flex: 1;
        background: var(--url);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
    }
    > .details {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: var(--padding);
      background: rgba(255, 255, 255, 0.3);
      font-size: var(--tiny-font-size-small);
    }
    &.deleted {
      opacity: 0.5;
    }
  }
</style>
