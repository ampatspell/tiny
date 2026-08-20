<script lang="ts">
  import type { UniversalFile } from '$lib/utils/files.svelte.js';
  import { url } from '$lib/utils/utils.js';
  import { fade } from 'svelte/transition';
  import Overlay from './overlay.svelte';

  let {
    file,
  }: {
    file: UniversalFile;
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
  <Overlay {file} />
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
