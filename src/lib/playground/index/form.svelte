<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/tiny/form/form.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Field from '$lib/tiny/form/content/field.svelte';

  let { properties }: { properties: IndexProperties } = $props();
  let fields = $derived(properties.fields);
</script>

<Form size="regular">
  <Content>
    <Field field={fields.title} />
    <Field field={fields.description} />
    <Field field={fields.background} />
    <Field field={fields.backgroundOffset} />
    <Field fields={[fields.indexBackgroundColor, fields.indexTextColor]} />
    <Field fields={[fields.backgroundColor, fields.textColor]} />
  </Content>
</Form>
