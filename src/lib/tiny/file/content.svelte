<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { UniversalFile } from '../files.svelte.ts';
  import { url } from '../utils/style.ts';
  import Description from './description.svelte';

  let {
    file,
    variant,
    isBusy,
  }: {
    file: UniversalFile;
    variant: Tiny.Thumbnail;
    isBusy?: boolean;
  } = $props();

  let image = $derived.by(() => file.variant.named(variant)?.url);
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
