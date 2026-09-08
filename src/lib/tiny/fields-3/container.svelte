<script lang="ts">
  import Tooltip from '#lib/tiny/floating/tooltip.svelte';
  import Icon from '#lib/tiny/icon.svelte';
  import TablerInfoCircle from '#lib/tiny/icons/tabler--info-circle.svelte';
  import type { Snippet } from 'svelte';
  import type { Field } from './field.svelte.ts';

  let {
    field,
    children,
  }: {
    field: Field;
    children?: Snippet;
  } = $props();

  let label = $derived(field.label);
  let isRequired = $derived(field.isRequired);
  let description = $derived(field.description);
  let error = $derived(field.touched.error);
</script>

<div class="field">
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
  .field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: default;
    user-select: none;
    min-width: 0;
    > .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: var(--tiny-font-size-small);
      gap: 5px;
      > .content {
        flex: 1;
        display: flex;
        flex-direction: row;
        gap: 3px;
        min-width: 0;
        > .label {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      > .error {
        white-space: nowrap;
        color: var(--tiny-accent-color-2);
      }
    }
  }
</style>
