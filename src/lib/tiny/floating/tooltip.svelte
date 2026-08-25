<script lang="ts">
  import {
    arrow as arrowMiddleware,
    computePosition,
    flip,
    offset as offsetMiddleware,
    shift,
    type OffsetOptions,
    type Placement,
  } from '@floating-ui/dom';
  import { Debounced } from 'runed';
  import type { Snippet } from 'svelte';
  import { px, recordToStyle } from '../utils/style.ts';

  let {
    children,
    label,
    offset,
    placement = 'top',
  }: {
    children?: Snippet;
    label?: string;
    offset?: OffsetOptions;
    placement?: Placement;
  } = $props();

  let reference = $state<HTMLDivElement>();
  let tooltip = $state<HTMLDivElement>();
  let arrow = $state<HTMLDivElement>();

  let show = $state({ reference: false, tooltip: false });
  let _isShown = new Debounced(() => show.reference || show.tooltip, 100);
  let isShown = $derived(_isShown.current);

  let tooltipStyle = $state<string>();
  let arrowStyle = $state<string>();

  $effect(() => {
    if (isShown && reference && tooltip && arrow) {
      computePosition(reference, tooltip, {
        placement,
        strategy: 'fixed',
        middleware: [offsetMiddleware(offset ?? 5), flip(), shift({ padding: 5 }), arrowMiddleware({ element: arrow })],
      }).then(({ x, y, placement, middlewareData }) => {
        tooltipStyle = recordToStyle({ left: px(x), top: px(y) });
        const arrow = middlewareData.arrow!;
        const side = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]!];
        arrowStyle = recordToStyle({
          left: px(arrow.x),
          top: px(arrow.y),
          [side!]: px(-3),
        });
      });
    }
  });
</script>

<svelte:window
  onclick={() => {
    show.reference = false;
    show.tooltip = false;
  }}
/>

{#if isShown}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <div
    class="tooltip"
    style={tooltipStyle}
    bind:this={tooltip}
    onmouseover={() => (show.tooltip = true)}
    onmouseout={() => (show.tooltip = false)}
  >
    <div class="content">
      <div class="label">{label}</div>
    </div>
    <div class="arrow" style={arrowStyle} bind:this={arrow}></div>
  </div>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
  class="reference"
  bind:this={reference}
  onmouseover={() => (show.reference = true)}
  onmouseout={() => (show.reference = false)}
>
  {@render children?.()}
</div>

<style lang="scss">
  .tooltip {
    --color: #fff;
    --background: #333;
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 8px;
    color: var(--color);
    background: var(--background);
    font-size: 11px;
    border-radius: 3px;
    cursor: default;
    user-select: none;
    > .content {
      max-width: 320px;
      min-width: 0;
      > .label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    > .arrow {
      --size: 6px;
      position: absolute;
      background: var(--background);
      width: var(--size);
      height: var(--size);
      transform: rotate(45deg);
    }
    box-shadow:
      0px 4px 6px -2px rgba(16, 24, 40, 0.06),
      0px 12px 32px -4px rgba(16, 24, 40, 0.14),
      0px 2px 8px 0px rgba(0, 0, 0, 0.12);
  }
  .reference {
    width: min-content;
  }
</style>
