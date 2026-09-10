<script lang="ts">
  import { getGalleryByPermalink } from '#lib/playground/galleries/galleries.remote.js';
  import { useFiles } from '#lib/tiny/files.svelte.js';
  import { url } from '#lib/tiny/utils/style.js';
  import { page } from '$app/state';
  import { innerHeight, innerWidth } from 'svelte/reactivity/window';

  let gallery = $derived(await getGalleryByPermalink({ permalink: page.params.permalink! }));
  let files = useFiles();

  let type = $derived.by(() => {
    let w = innerWidth.current;
    let h = innerHeight.current;
    return w && h && w > h ? ('landscape' as const) : ('portrait' as const);
  });
</script>

<div class={['page', `type-${type}`]}>
  <div class="header">
    <div class="title">{gallery.name}</div>
  </div>
  <div class="files">
    {#each gallery.files.filter((file) => file.file) as file (file.id)}
      <div class="file" style:--url={url(files.resolve({ id: file.file!.id, variant: '2048x2048' }))}></div>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    &.type-landscape {
      --gap: 50px;
      --height: calc(100vh);
    }
    &.type-portrait {
      --gap: 0px;
      --height: calc(100vw);
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 50px;
    padding: 50px 0;
    > .header {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    > .files {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
      > .file {
        height: var(--height);
        background: var(--url) center center / contain no-repeat;
      }
    }
  }
</style>
