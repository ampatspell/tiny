<script lang="ts">
  import { getGalleryByPermalink } from '#lib/playground/galleries/galleries.remote.js';
  import { useFiles } from '#lib/tiny/files.svelte.js';
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
  <div class="blocks">
    <div class="block">
      <div class="description">
        <div class="title">{gallery.name}</div>
      </div>
    </div>
    {#each gallery.files.filter((file) => file.file) as file (file.id)}
      <div class="block">
        <div class="description">{file.name}</div>
        <div class="details">
          <img
            class="file"
            draggable="false"
            alt={file.name}
            src={files.resolve({ id: file.file!.id, variant: '2048x2048' })}
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    > .blocks {
      > .block {
        > .description {
          font-size: var(--tiny-font-size-small);
          > .title {
            font-weight: 600;
            font-size: var(--tiny-font-size);
          }
        }
      }
    }
    &.type-landscape {
      > .blocks {
        display: flex;
        flex-direction: column;
        > .block {
          display: flex;
          flex-direction: row;
          padding: 50px;
          > .description {
            width: 300px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          > .details {
            flex: 1;
            display: flex;
            flex-direction: column;
            > .file {
              max-height: calc(100vh - 100px);
            }
          }
        }
      }
    }
    &.type-portrait {
      padding: 25px 0;
      > .blocks {
        display: flex;
        flex-direction: column;
        gap: 25px;
        > .block {
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
          > .description {
            padding: 0 10px;
          }
          > .details {
            > .file {
              max-height: calc(100vh - 35px);
            }
          }
        }
      }
    }
  }
</style>
