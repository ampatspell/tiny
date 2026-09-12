<script lang="ts">
  import type { ItemData } from '#lib/tiny/dropdown/basic/items.svelte';
  import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';

  type Model = {
    id: string;
    label: string;
  } & ItemData;

  let items = $state<Model[]>([
    {
      id: 'one',
      label: 'Duck',
    },
    {
      id: 'two',
      label: 'Hamster',
    },
    {
      id: 'three',
      label: 'Zeeba',
      state: 'critical',
    },
  ]);

  let fields = withDataFields({
    data: {
      role: 'admin',
    },
  }).define(({ dropdown }) => {
    return {
      role: dropdown('role', {
        items: getter(() => items),
        identifier: 'id',
      }),
    };
  });
</script>

<div class="page">
  <Form>
    <Fields field={fields.record.role} />
  </Form>
</div>

<style lang="scss">
  .page {
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
</style>
