<script lang="ts">
  import { useFiles } from '#lib/tiny/files.svelte.js';
  import { px, url } from '#lib/tiny/utils/style.js';
  import { resolve } from '$app/paths';
  import { getIndex } from './index.remote.js';

  let files = useFiles();
  let index = $derived(await getIndex());
  let background = $derived(files.asRemote(index.background)?.variant.named('2048x2048'));
  let offset = $derived(index.backgroundOffset);
  let backgroundColor = $derived(index.indexBackgroundColor);
  let textColor = $derived(index.indexTextColor);
</script>

<div
  class={['page', background && 'has-background']}
  style:--background-color={backgroundColor}
  style:--text-color={textColor}
>
  <div class="background" style:--background={url(background?.url)} style:--offset={px(offset)}></div>
  <div class="title">{index.title}</div>
  <div class="description">{index.description}</div>
  <div class="galleries">
    {#each index.galleries as gallery (gallery.id)}
      <a href={resolve('/galleries/[permalink]', { permalink: gallery.permalink })} class="gallery">{gallery.name}</a>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 50px;
    position: relative;
    color: var(--text-color);
    > .background {
      z-index: -1;
      position: absolute;
      top: var(--offset);
      bottom: var(--offset);
      left: var(--offset);
      right: var(--offset);
      background: var(--background);
      background-color: var(--background-color);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
    > .title {
      font-size: 21px;
    }
    > .description {
      font-size: 13px;
    }
    > .galleries {
      padding: 10px 0 0 0;
      > .gallery {
        color: var(--text-color);
        font-size: 13px;
      }
    }
  }
</style>
