<script lang="ts">
  import { fade } from 'svelte/transition';
  import Description from './description.svelte';
  import { url } from '../utils/style.ts';
  import type { UniversalFile } from '../files.svelte.ts';

  let {
    file,
    isBusy,
  }: {
    file: UniversalFile;
    isBusy?: boolean;
  } = $props();

  let image = $derived.by(() => file.variant.forSize({ width: 2048, height: 2048 })?.url);
</script>

<div class="content">
  {#if file.isImage}
    <div class="image">
      {#key file.url}
        <div class="content" transition:fade style:--url={url(image)}></div>
      {/key}
    </div>
  {/if}
  <Description {file} {isBusy} />
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
