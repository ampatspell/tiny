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

  let blocks = $state<HTMLElement[]>([]);

  let getCurrent = () => {
    let wy = window.scrollY;
    return blocks.find((block) => {
      let rect = block.getBoundingClientRect();
      let ry = rect.y + wy;
      return ry > wy;
    });
  };

  let scrollIntoView = (e: Event, cb: (current: HTMLElement) => Element | null) => {
    e.preventDefault();
    let current = getCurrent();
    if (current) {
      let next = cb(current);
      if (next instanceof HTMLElement) {
        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  let onkeydown = (e: KeyboardEvent) => {
    if (!e.metaKey && !e.altKey && !e.ctrlKey) {
      if (e.key === 'ArrowUp') {
        scrollIntoView(e, (curr) => curr.previousElementSibling);
      } else if (e.key === 'ArrowDown') {
        scrollIntoView(e, (curr) => curr.nextElementSibling);
      }
    }
  };
</script>

<svelte:window {onkeydown} />

<div class={['page', `type-${type}`]}>
  <div class="blocks">
    <div class="block">
      <div class="description">
        <div class="title">{gallery.name}</div>
      </div>
    </div>
    {#each gallery.files.filter((file) => file.file) as file, i (file.id)}
      <div class="block" bind:this={blocks[i]}>
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
        > .details {
          > .file {
            object-fit: contain;
            object-position: right;
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
              max-height: calc(100vh - 50px);
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
            padding: 0 15px;
          }
          > .details {
            > .file {
              max-height: calc(100vh - 30px);
            }
          }
        }
      }
    }
  }
</style>
