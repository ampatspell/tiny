<script lang="ts">
  import { getGalleryByPermalink } from '#lib/playground/galleries/galleries.remote.js';
  import { useFiles } from '#lib/tiny/files.svelte.js';
  import { isTruthy, sortedBy } from '#lib/tiny/utils/array.js';
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
    let wh = window.innerHeight;

    let visible = sortedBy(
      blocks
        .map((el) => {
          let rect = el.getBoundingClientRect();
          let ry = rect.y + wy;
          let rh = rect.height;
          let a = ry + rh > wy;
          let b = ry < wy + wh;
          if (a && b) {
            let top = Math.max(ry, wy);
            let bottom = Math.min(ry + rh, wy + wh);
            let visible = bottom - top;
            let fraction = visible / rh;
            return {
              el,
              height: rh,
              fraction,
            };
          }
        })
        .filter(isTruthy),
      { value: (v) => v.fraction, direction: 'desc' },
    );

    console.log(visible.map((v) => `${v.el.innerText} ${v.fraction}`));

    return visible[0]?.el;
  };

  let scrollIntoView = (e: Event, cb: (current: HTMLElement) => Element | null) => {
    e.preventDefault();
    let visible = getCurrent();
    let next = cb(visible);
    if (next instanceof HTMLElement) {
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    {#each gallery.files.filter((file) => file.file) as file, i (file.id)}
      <div class="block" bind:this={blocks[i]}>
        <div class="content">
          <div class="description">
            {#if i === 0}
              <div class="main">
                <div class="title">{gallery.name}</div>
              </div>
            {/if}
            <div class="footer">
              {file.name}
            </div>
          </div>
          <div class="details">
            <img
              class="file"
              draggable="false"
              alt={file.name}
              src={files.resolve({ id: file.file!.id, variant: '2048x2048' })}
            />
          </div>
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
        font-size: var(--tiny-font-size-small);
      }
    }
    &.type-landscape {
      > .blocks {
        display: flex;
        flex-direction: column;
        > .block {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
          > .content {
            max-height: 100%;
            padding: 50px;
            display: flex;
            flex-direction: row;
            > .description {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              width: 300px;
              > .main {
                flex: 1;
                > .title {
                  font-size: var(--tiny-font-size);
                  font-weight: 700;
                }
              }
            }
            > .details {
              flex: 1;
              height: 100%;
              > .file {
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: right;
              }
            }
          }
        }
      }
    }
  }
</style>
