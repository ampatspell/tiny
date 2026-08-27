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
    secondary,
  }: {
    title: string;
    model: { email: Property<string>; password: Property<string>; perform: () => void };
    secondary: { label: string; onClick: () => void };
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
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="secondary" onclick={secondary.onClick}>{secondary.label}</div>
      <Button label={title} onClick={model.perform} />
    </Actions>
  </Form>
</Center>

<style lang="scss">
  .secondary {
    flex: 1;
    font-size: var(--tiny-font-size-small);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
