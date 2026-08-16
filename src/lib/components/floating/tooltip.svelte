<script lang="ts">
  import { px } from '$lib/utils/utils.js';
  import {
    arrow as arrowMiddleware,
    computePosition,
    flip,
    offset as offsetMiddleware,
    shift,
    type OffsetOptions,
  } from '@floating-ui/dom';
  import { Debounced } from 'runed';
  import type { Snippet } from 'svelte';

  let { children, label, offset }: { children?: Snippet; label?: string; offset?: OffsetOptions } = $props();
  let reference = $state<HTMLDivElement>();
  let tooltip = $state<HTMLDivElement>();
  let arrow = $state<HTMLDivElement>();

  let show = $state({ reference: false, tooltip: false });
  let _isShown = new Debounced(() => show.reference || show.tooltip, 100);
  let isShown = $derived(_isShown.current);

  let tooltipStyle = $state<string>();
  let arrowStyle = $state<string>();

  let join = (obj: Record<string, unknown>) =>
    Object.keys(obj)
      .reduce<string[]>((arr, key) => {
        return [...arr, `${key}: ${obj[key]}`];
      }, [])
      .join('; ');

  $effect(() => {
    if (isShown && reference && tooltip && arrow) {
      computePosition(reference, tooltip, {
        placement: 'right',
        strategy: 'fixed',
        middleware: [offsetMiddleware(offset ?? 5), flip(), shift({ padding: 5 }), arrowMiddleware({ element: arrow })],
      }).then(({ x, y, placement, middlewareData }) => {
        tooltipStyle = join({ left: px(x), top: px(y) });
        const arrow = middlewareData.arrow!;
        const side = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]!];
        arrowStyle = join({
          left: px(arrow.x),
          top: px(arrow.y),
          [side!]: px(-2),
        });
      });
    }
  });
</script>

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
    max-width: 320px;
    padding: 4px 8px;
    color: var(--color);
    background: var(--background);
    font-size: 12px;
    border-radius: 3px;
    font-weight: 600;
    > .arrow {
      position: absolute;
      background: var(--background);
      width: 3px;
      height: 3px;
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
