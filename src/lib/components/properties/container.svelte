<script lang="ts">
  import type { Property } from '$lib/properties/property.svelte.js';
  import type { Snippet } from 'svelte';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { property, children }: { property: Property<any>; children?: Snippet } = $props();
</script>

<div class="property">
  {#if property.meta.label}
    <div class="header">
      <div class="content">
        <div class="label">{property.meta.label}</div>
        {#if property.meta.isRequired}
          <div class="required">*</div>
        {/if}
      </div>
      {#if property.touched.error}
        <div class="error">{property.touched.error}</div>
      {/if}
    </div>
  {/if}
  <div class="content">{@render children?.()}</div>
</div>

<style lang="scss">
  .property {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    > .header {
      display: flex;
      flex-direction: row;
      font-size: var(--dark-font-size-small);
      gap: 5px;
      > .content {
        display: flex;
        flex-direction: row;
        gap: 3px;
        flex: 1;
      }
      > .error {
        white-space: nowrap;
        color: var(--dark-accent-color-2);
      }
    }
  }
</style>
