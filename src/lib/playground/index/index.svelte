<script lang="ts">
  import { asFile } from '#lib/tiny/utils/files.svelte.js';
  import { px, url } from '#lib/tiny/utils/style.js';
  import { getIndex } from './index.remote.js';

  let index = $derived(await getIndex());
  let background = $derived(asFile(index.background));
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
  }
</style>
