<script lang="ts">
  import type { Floater } from './floater.svelte.ts';
  import { autoUpdate, computePosition } from '@floating-ui/dom';
  import { elementContainsEventTarget, px } from '$lib/utils/utils.js';
  import { on } from 'svelte/events';

  let { floater }: { floater: Floater } = $props();

  let reference = $derived(floater.reference);
  let snippet = $derived(floater.snippet);
  let opts = $derived(floater.opts);

  let element = $state<HTMLDivElement>();

  $effect(() => {
    return on(
      document.body,
      'click',
      (e) => {
        if (element) {
          if (!elementContainsEventTarget(element, e)) {
            floater.close();
          }
          if (e.target === reference) {
            e.stopPropagation();
          }
        }
      },
      { capture: true },
    );
  });

  let position = $state<{ x: number; y: number }>();

  const update = async () => {
    if (reference && element) {
      position = await computePosition(reference, element, floater.position);
    }
  };

  $effect(() => {
    if (reference && element) {
      update();
      return autoUpdate(reference, element, () => update());
    }
  });
</script>

<div class="floater" style:--x={px(position?.x)} style:--y={px(position?.y)} bind:this={element}>
  {@render snippet(opts)}
</div>

<style lang="scss">
  .floater {
    position: fixed;
    top: var(--y);
    left: var(--x);
    z-index: 1;
  }
</style>
