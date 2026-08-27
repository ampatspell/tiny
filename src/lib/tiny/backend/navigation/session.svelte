<script lang="ts">
  import TablerUserSquareRounded from '$lib/tiny/icons/tabler--user-square-rounded.svelte';
  import Button from '$lib/tiny/button/button.svelte';
  import Card from '$lib/tiny/card.svelte';
  import Actions from '$lib/tiny/form/actions.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Label from '$lib/tiny/form/content/label.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Header from '$lib/tiny/form/header.svelte';
  import Item from './item.svelte';
  import { useFloaters } from '$lib/tiny/floating/floaters.svelte.js';
  import { getToken, signOut } from '$lib/tiny/auth/auth.remote.js';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { basic } from '$lib/tiny/floating/position.js';

  let floaters = useFloaters();
  let current = $derived(await getToken());
  let item = $state<Item>();

  let onClick = async () => {
    const reference = item?.element;
    if (reference) {
      floaters.open({
        reference: () => reference,
        position: basic({
          placement: 'right-end',
          offset: { mainAxis: 5 },
        }),
        snippet: session,
        request: undefined,
        close: null,
      });
    }
  };

  let onSignOut = async () => {
    goto(resolve('/'));
    await signOut();
  };
</script>

{#if current}
  <Item bind:this={item} icon={TablerUserSquareRounded} {onClick} />
{/if}

{#snippet session()}
  <Card width="fit">
    <Form size="regular">
      <Header title="Tiny" />
      <Content>
        <Row>
          <Label value={`${current?.email} (${current?.type})`} />
        </Row>
        <Actions>
          <Button label="Sign out" onClick={onSignOut} />
        </Actions>
      </Content>
    </Form>
  </Card>
{/snippet}
