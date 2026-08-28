<script lang="ts">
  import type { IndexProperties } from './index.svelte.ts';
  import Form from '$lib/tiny/form/form.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Fields from '$lib/tiny/form/content/fields.svelte';

  let { properties }: { properties: IndexProperties } = $props();
  let fields = $derived(properties.fields);
</script>

<Form size="regular">
  <Content>
    <Fields field={fields.title} />
    <Fields field={fields.description} />
    <Fields field={fields.background} />
    <Fields field={fields.backgroundOffset} />
    <Fields fields={[fields.indexBackgroundColor, fields.indexTextColor]} />
    <Fields fields={[fields.backgroundColor, fields.textColor]} />
  </Content>
</Form>
