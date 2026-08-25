<script lang="ts">
  type Description = {
    value: string | undefined;
    placeholder: string | undefined;
  };

  let { label, description: _description }: { label: string; description?: string | Description } = $props();

  let description = $derived.by<Description>(() => {
    if (typeof _description === 'object') {
      return _description;
    } else {
      return {
        value: _description,
        placeholder: undefined,
      };
    }
  });
</script>

<div class="label">
  <div class="value">{label}</div>
  <div class={['description', !description.value && 'blank']}>{description.value || description.placeholder}</div>
</div>

<style lang="scss">
  .label {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: var(--dark-font-size-small);
    gap: 1px;
    min-width: 0;
    > .value {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.blank {
        opacity: 0.5;
      }
    }
  }
</style>
