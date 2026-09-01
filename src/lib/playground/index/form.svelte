<script lang="ts">
  import type { IndexModel } from './index.svelte.ts';
  import Form from '#lib/tiny/form/form.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';

  let { properties }: { properties: IndexModel } = $props();
</script>

<Form size="regular">
  <Content>
    <Fields field={properties.title} />
    <Fields field={properties.description} />
    <Fields field={properties.background} />
    <Fields field={properties.backgroundOffset} />
    <Fields fields={[properties.indexBackgroundColor, properties.indexTextColor]} />
    <Fields fields={[properties.backgroundColor, properties.textColor]} />
  </Content>
</Form>
