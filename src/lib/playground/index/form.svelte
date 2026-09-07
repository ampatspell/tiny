<script lang="ts">
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import type { IndexModel } from './index.svelte.ts';

  let { model }: { model: IndexModel } = $props();
  let fields = $derived(model.fields);
</script>

<Form size="wide">
  <Content>
    <Fields field={fields.title} />
    <Fields field={fields.description} />
    <Fields field={fields.background} />
    <Fields field={fields.backgroundOffset} />
    <Fields fields={[fields.indexBackgroundColor, fields.indexTextColor]} />
    <Fields fields={[fields.backgroundColor, fields.textColor]} />
  </Content>
</Form>
