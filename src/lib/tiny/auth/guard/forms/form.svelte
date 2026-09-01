<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Center from '#lib/tiny/center.svelte';
  import type { InputField } from '#lib/tiny/fields/input/field.svelte.js';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import TinyForm from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';

  let {
    title,
    model,
    secondary,
  }: {
    title: string;
    model: { email: InputField<string>; password: InputField<string>; perform: () => void };
    secondary: { label: string; onClick: () => void };
  } = $props();
</script>

<Center>
  <TinyForm size="small">
    <Header {title} />
    <Fields field={model.email} />
    <Fields field={model.password} />
    <Actions>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="secondary" onclick={secondary.onClick}>{secondary.label}</div>
      <Button label={title} onClick={model.perform} />
    </Actions>
  </TinyForm>
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
