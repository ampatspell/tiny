<script lang="ts">
  import Icon from '#lib/tiny/icon.svelte';
  import LucideCat from '#lib/tiny/icons/lucide--cat.svelte';
  import { px } from '#lib/tiny/utils/style.js';
  import type { Point } from '#lib/tiny/utils/utils.js';

  let point = $state<Point>();

  let onmousemove = (e: MouseEvent) => {
    let x = e.clientX;
    let y = e.clientY;
    point = {
      x,
      y,
    };
  };
</script>

<svelte:window {onmousemove} />

{#if point}
  <div class="cat" style:--x={px(point.x)} style:--y={px(point.y)}>
    <Icon icon={LucideCat} />
  </div>
{/if}

<style lang="scss">
  .cat {
    --size: 31px;
    --xo: 10px;
    --yo: 15px;
    position: fixed;
    width: var(--size);
    height: var(--size);
    border-radius: var(--size);
    top: calc(var(--y) + var(--yo));
    left: calc(var(--x) + var(--xo));
    background: #fff;
    padding: 2px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
