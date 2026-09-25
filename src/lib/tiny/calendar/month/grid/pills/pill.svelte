<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children, deg: _deg }: { children?: Snippet; deg?: number } = $props();
  let deg = $derived(Math.max(Math.min(_deg ?? 0, 360), 0));
</script>

<div class="pill" style:--deg={deg}>
  {@render children?.()}
</div>

<style lang="scss">
  .pill {
    font-size: var(--tiny-font-size-medium);
    --base: var(--tiny-accent-color-1);
    --background: hwb(from var(--base) calc(h + var(--deg)) w b);
    background: var(--background);
    color: contrast-color(var(--background));
    padding: 0 3px;
    height: calc(14px + 6px);
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:empty {
      display: none;
    }
  }
</style>
