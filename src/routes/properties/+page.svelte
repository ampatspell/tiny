<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Input from '$lib/components/input.svelte';
  import { usePropertiesContext } from './context.svelte.ts';
  import { useProperty } from './property.svelte.ts';

  const context = usePropertiesContext();

  const title = useProperty<string>({
    value: 'Hello',
    validate: (value: string) => {
      if (!value.trim()) {
        return 'Is required';
      }
    },
  });
</script>

<div class="page">
  <div class="row"><Input value={title.value} onInput={title.update} /></div>
  <div class="row">value={title.value} isDirty={title.isDirty} isValid={title.isValid} error={title.error}</div>
  <div class="row">isTouched={title.isTouched} isValid={title.touched.isValid} error={title.touched.error}</div>
  <div class="row"><Button label="Touch" onClick={() => context.touch()} /></div>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
  }
</style>
