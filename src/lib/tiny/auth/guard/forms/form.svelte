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
  <TinyForm size="small" onSubmit={model.perform}>
    <Header {title}>
      <Label value={model.error} />
    </Header>
    <Content>
      <Fields field={model.fields.email} />
      <Fields field={model.fields.password} />
    </Content>
    <Actions alignment="space-between">
      <Button size="small" variant="link" label={secondary.label} onClick={secondary.onClick} />
      <Button size="small" type="submit" label={title} />
    </Actions>
  </TinyForm>
</Center>
