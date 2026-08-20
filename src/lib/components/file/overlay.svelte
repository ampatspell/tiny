<script lang="ts">
  import type { UniversalFile } from '$lib/utils/files.svelte.js';
  import { formatBytes } from '$lib/utils/utils.js';

  let {
    file,
  }: {
    file: UniversalFile;
  } = $props();

  let hover = $derived(file.isImage);
</script>

<div class={['overlay', hover && 'on-hover']}>
  <div class="caption">{file.name} ({formatBytes(file.size)})</div>
</div>

<style lang="scss">
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-width: 0;
    > .caption {
      padding: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &.on-hover {
      opacity: 0;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(1px);
      transition: 0.15s ease-in-out opacity;
      &:hover {
        opacity: 1;
      }
    }
  }
</style>
