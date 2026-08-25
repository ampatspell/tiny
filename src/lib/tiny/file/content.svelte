<script lang="ts">
  import type { UniversalFile } from '$lib/tiny/utils/files.svelte.js';
  import { url } from '$lib/tiny/utils/utils.js';
  import { fade } from 'svelte/transition';
  import Description from './description.svelte';

  let {
    file,
    onDelete,
  }: {
    file: UniversalFile;
    onDelete: () => void;
  } = $props();
</script>

<div class="content">
  {#if file.isImage}
    <div class="image">
      {#key file.url}
        <div class="content" transition:fade style:--url={url(file.url)}></div>
      {/key}
    </div>
  {/if}
  <Description {file} {onDelete} />
</div>

<style lang="scss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    > .image {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      > .content {
        --padding: 15px;
        position: absolute;
        top: var(--padding);
        left: var(--padding);
        bottom: var(--padding);
        right: var(--padding);
        background: var(--url);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
      }
    }
  }
</style>
