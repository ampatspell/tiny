<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getButtonContext } from './button.svelte';

  let { label, children }: { label?: string; children?: Snippet } = $props();

  let context = getButtonContext();

  $effect.pre(() => {
    if (label || children) {
      context.label = true;
      return () => {
        context.label = false;
      };
    }
  });
</script>

{#if children}
  <div class="label">{@render children()}</div>
{:else if label}
  <div class="label">{label}</div>
{/if}
