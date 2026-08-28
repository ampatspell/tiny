<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/tiny/form/form.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Field from '$lib/tiny/properties/editors/field.svelte';

  let { properties }: { properties: IndexProperties } = $props();
  let fields = $derived(properties.fields);
</script>

<Form size="regular">
  <Content>
    <Row>
      <Field field={fields.title} />
    </Row>
    <Row>
      <Field field={fields.description} />
    </Row>
    <Row>
      <Field field={fields.background} />
    </Row>
    <Row>
      <Field field={fields.backgroundOffset} />
    </Row>
    <Row>
      <Field field={fields.indexBackgroundColor} />
      <Field field={fields.indexTextColor} />
    </Row>
    <Row>
      <Field field={fields.backgroundColor} />
      <Field field={fields.textColor} />
    </Row>
  </Content>
</Form>
