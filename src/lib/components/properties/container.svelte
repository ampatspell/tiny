<script lang="ts">
  import type { Property } from '$lib/properties/property.svelte.js';
  import type { Snippet } from 'svelte';
  import Icon from '../icon.svelte';
  import Tooltip from '../floating/tooltip.svelte';
  import TablerInfoCircle from '$lib/icons/tabler--info-circle.svelte';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { property, children }: { property: Property<any>; children?: Snippet } = $props();
  let label = $derived(property.meta.label);
  let isRequired = $derived(property.meta.isRequired);
  let description = $derived(property.meta.description);
  let error = $derived(property.touched.error);
</script>

<div class="property">
  {#if label}
    <div class="header">
      <div class="content">
        <div class="label">{label}</div>
        {#if isRequired}
          <div class="required">*</div>
        {/if}
      </div>
      {#if error}
        <div class="error">{error}</div>
      {/if}
      {#if description}
        <Tooltip label={description}>
          <Icon icon={TablerInfoCircle} size="tiny" />
        </Tooltip>
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
      align-items: center;
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
