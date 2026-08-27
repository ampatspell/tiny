<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { getToken, signOut } from '$lib/tiny/auth/auth.remote.js';
  import Button from '$lib/tiny/button/button.svelte';
  import Content from '$lib/tiny/form/content/content.svelte';
  import Label from '$lib/tiny/form/content/label.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Header from '$lib/tiny/form/header.svelte';

  let user = $derived(await getToken());
  let onSignOut = async () => {
    await signOut();
    goto(resolve('/'));
  };
</script>

{#if user}
  <div class="profile">
    <Form>
      <Header title="Profile" />
      <Content>
        <Row>
          <Label value={user.email} />
        </Row>
        <Row>
          <Label value={user.type} />
        </Row>
        <Row>
          <Button label="Sign out" onClick={onSignOut} />
        </Row>
      </Content>
    </Form>
  </div>
{/if}
