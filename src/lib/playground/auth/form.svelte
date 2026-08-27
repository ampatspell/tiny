<script lang="ts">
  import Button from '$lib/tiny/button/button.svelte';
  import Center from '$lib/tiny/center.svelte';
  import Actions from '$lib/tiny/form/actions.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Header from '$lib/tiny/form/header.svelte';
  import Input from '$lib/tiny/properties/input.svelte';
  import type { Property } from '$lib/tiny/properties/property.svelte.js';

  let {
    title,
    model,
  }: {
    title: string;
    model: { email: Property<string>; password: Property<string>; perform: () => void };
  } = $props();
</script>

<Center>
  <Form size="small">
    <Header {title} />
    <Row>
      <Input property={model.email} />
    </Row>
    <Row>
      <Input property={model.password} type="password" />
    </Row>
    <Actions>
      <Button label={title} onClick={model.perform} />
    </Actions>
  </Form>
</Center>
