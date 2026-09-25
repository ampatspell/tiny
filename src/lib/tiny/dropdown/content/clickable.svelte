<script lang="ts">
  import { useFloaters } from '#lib/tiny/floating/floaters/model.svelte.js';
  import { basic } from '#lib/tiny/floating/position.js';
  import type { ComputePositionConfig } from '@floating-ui/dom';
  import type { Snippet } from 'svelte';

  let {
    position,
    content,
    children,
  }: {
    position?: ComputePositionConfig;
    content: Snippet<[{ close: () => void; isOpen: boolean }]>;
    children: Snippet<[{ open: () => Promise<void>; isOpen: boolean }]>;
  } = $props();

  let floaters = useFloaters();
  let reference = $state<HTMLDivElement>();
  let isOpen = $state(false);

  let open = async () => {
    isOpen = true;
    try {
      await floaters.open({
        reference,
        position:
          position ??
          basic({
            offset: {
              crossAxis: -4,
              mainAxis: 3,
            },
          }),
        request: null,
        snippet,
        close: null,
      }).response;
    } finally {
      isOpen = false;
    }
  };
</script>

{#snippet snippet({ close }: { close: () => void })}
  {@render content({ close, isOpen })}
{/snippet}

<div bind:this={reference}>
  {@render children({ open, isOpen })}
</div>
