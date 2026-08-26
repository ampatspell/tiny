<script lang="ts">
  import type { Snippet } from 'svelte';

  let { onClick, children }: { onClick: () => void; children: Snippet } = $props();

  let onclick = () => onClick();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="item" {onclick}>
  {@render children()}
</div>

<style lang="scss">
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 30px;
    min-height: 30px;
    padding: 0 10px;
    min-width: 0;
    border-radius: 3px;
    cursor: default;
    &:hover {
      background: var(--tiny-selected-background-color-1);
    }
  }
</style>
