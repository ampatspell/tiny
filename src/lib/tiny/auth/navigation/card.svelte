<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Button from '$lib/tiny/button/button.svelte';
  import Card from '$lib/tiny/card.svelte';
  import Actions from '$lib/tiny/form/actions.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import FormLabel from '$lib/tiny/form/content/label.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Header from '$lib/tiny/form/header.svelte';
  import type { TokenPayload } from '$lib/tiny/server/users/users.js';
  import { signOut } from '../auth.remote.ts';

  let { token }: { token: TokenPayload } = $props();

  let onSignOut = async () => {
    await goto(resolve('/'));
    await signOut();
  };
</script>

<Card width="fit">
  <Form size="regular">
    <Header title={token.email} />
    <Content>
      <Row>
        <FormLabel value={token.role} />
      </Row>
      <Actions>
        <Button label="Sign out" onClick={onSignOut} />
      </Actions>
    </Content>
  </Form>
</Card>
