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
  import Icon from '../../button/icon.svelte';
  import ButtonLabel from '../../button/label.svelte';
  import TablerX from '../../icons/tabler--x.svelte';
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
        <FormLabel value={token.type} />
      </Row>
      <Actions>
        <Button onClick={onSignOut}>
          <Icon icon={TablerX} />
          <ButtonLabel label="Sign out" />
        </Button>
      </Actions>
    </Content>
  </Form>
</Card>
