<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Center from '#lib/tiny/center.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Label from '#lib/tiny/form/content/label.svelte';
  import TinyForm from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import type { UseForm } from './model.svelte.ts';

  let {
    title,
    model,
    secondary,
  }: {
    title: string;
    model: UseForm;
    secondary: { label: string; onClick: () => void };
  } = $props();
</script>

<Center>
  <TinyForm size="small">
    <Header {title}>
      <Label value={model.error} />
    </Header>
    <Content>
      <Fields field={model.fields.email} />
      <Fields field={model.fields.password} />
    </Content>
    <Actions>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="secondary" onclick={secondary.onClick}>{secondary.label}</div>
      <Button type="submit" label={title} onClick={model.perform} />
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
