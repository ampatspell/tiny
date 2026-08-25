<script lang="ts">
  import { elementContainsEventTarget, getActiveInputElement } from '../utils/dom.ts';
  import { px } from '../utils/style.ts';
  import type { Floater } from './floater.svelte.ts';
  import { autoUpdate, computePosition } from '@floating-ui/dom';

  let { floater }: { floater: Floater } = $props();

  let reference = $derived(floater.reference);
  let snippet = $derived(floater.snippet);
  let opts = $derived(floater.opts);

  let element = $state<HTMLDivElement>();

  let onWindowClick = (e: MouseEvent) => {
    if (element) {
      if (!elementContainsEventTarget(element, e)) {
        e.preventDefault();
        e.stopPropagation();
        floater.close();
      }
    }
  };

  let onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !getActiveInputElement()) {
      floater.close();
    }
  };

  let position = $state<{ x: number; y: number }>();

  const update = async () => {
    if (reference && element) {
      position = await computePosition(reference, element, floater.position);
    }
  };

  $effect(() => {
    if (reference && element) {
      return autoUpdate(reference, element, () => update());
    }
  });
</script>

<svelte:window onclickcapture={onWindowClick} onkeydown={onKey} />

<div class="floater" style:--x={px(position?.x)} style:--y={px(position?.y)} bind:this={element}>
  {@render snippet(opts)}
</div>

<style lang="scss">
  .floater {
    position: fixed;
    top: var(--y);
    left: var(--x);
  }
</style>
