<script lang="ts">
  import type { Property } from '$lib/tiny/properties/property.svelte.js';
  import type { Snippet } from 'svelte';
  import TablerInfoCircle from '$lib/tiny/icons/tabler--info-circle.svelte';
  import Tooltip from '../floating/tooltip.svelte';
  import Icon from '../icon.svelte';

  let {
    property,
    children,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    property: Property<any>;
    children?: Snippet;
  } = $props();

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
          <Tooltip label="Required">
            <div class="required">*</div>
          </Tooltip>
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
    cursor: default;
    > .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: var(--tiny-font-size-small);
      gap: 5px;
      > .content {
        display: flex;
        flex-direction: row;
        gap: 3px;
        flex: 1;
      }
      > .error {
        white-space: nowrap;
        color: var(--tiny-accent-color-2);
      }
    }
  }
</style>
