<script lang="ts">
  import Input from '$lib/components/input.svelte';
  import { useProperty } from './property.svelte.ts';

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
  <div class="row"><Input value={title.value} onInput={(value) => title.update(value)} /></div>
  <div class="row">value={title.value} isDirty={title.isDirty} isValid={title.isValid} error={title.error}</div>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
  }
</style>
