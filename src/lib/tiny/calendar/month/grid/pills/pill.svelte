<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    deg?: number;
  } & (
    | {
        label: string | undefined;
      }
    | {
        children: Snippet | undefined;
      }
  );

  // eslint-disable-next-line svelte/no-unused-props
  let props: Props = $props();

  let deg = $derived(Math.max(Math.min(props.deg ?? 0, 360), 0));
</script>

<div class="pill" style:--deg={deg}>
  <div class="content">
    {#if 'children' in props}
      {@render props.children?.()}
    {:else if 'label' in props}
      {props.label}
    {/if}
  </div>
</div>

<style lang="scss">
  .pill {
    --base: var(--tiny-accent-color-1);
    --background: hwb(from var(--base) calc(h + var(--deg)) w b);
    font-size: var(--tiny-font-size-medium);
    background: var(--background);
    color: contrast-color(var(--background));
    padding: 0 4px;
    height: calc(14px + 6px);
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 0;
    > .content {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:has(> .content:empty) {
      display: none;
    }
  }
</style>
