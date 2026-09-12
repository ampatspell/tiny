<script lang="ts">
  import { getUserById } from '#lib/tiny/auth/users.remote.js';
  import { useUserModel } from '#lib/tiny/auth/users.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Fields from '#lib/tiny/form/content/fields.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Editing from '#lib/tiny/layout/editing/editing.svelte';
  import { useEditingLayout } from '#lib/tiny/layout/editing/layout.svelte.js';
  import Section from '#lib/tiny/page/section.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

  let id = $derived(page.params.id!);
  let data = $derived(await getUserById({ id }));

  let model = useUserModel({ data: getter(() => data) });
  let fields = $derived(model.fields);

  let layout = useEditingLayout({
    model,
  });
</script>

<Editing {layout}>
  <Section>
    <Form>
      <Content>
        <Fields field={fields.email} />
        <Fields field={fields.role} />
        <Fields field={fields.password} />
      </Content>
    </Form>
  </Section>
</Editing>
