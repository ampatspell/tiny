<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    height = 'regular',
    children,
  }: {
    title?: string;
    height?: 'regular' | 'fill';
    children?: Snippet;
  } = $props();
</script>

<div class={['section', `height-${height}`]}>
  {#if title}
    <div class="header">
      <div class="title">{title}</div>
    </div>
  {/if}
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .section {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--dark-border-color-1);
    > .header {
      cursor: default;
      padding: 10px 10px 5px 10px;
      > .title {
        font-weight: 600;
      }
    }
    > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    &:last-child {
      border: none;
    }
    &.height-fill {
      flex: 1;
    }
  }
</style>
