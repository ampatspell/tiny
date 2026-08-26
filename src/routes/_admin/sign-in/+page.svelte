<script lang="ts">
  import { useSignIn } from '$lib/playground/auth/auth.svelte.js';
  import Button from '$lib/tiny/button/button.svelte';
  import Actions from '$lib/tiny/form/actions.svelte';
  import Row from '$lib/tiny/form/content/row.svelte';
  import Form from '$lib/tiny/form/form.svelte';
  import Header from '$lib/tiny/form/header.svelte';
  import Input from '$lib/tiny/properties/input.svelte';

  let model = useSignIn();
</script>

<div class="page">
  <Form size="small">
    <Header title="Sign in" />
    <Row>
      <Input property={model.email} />
    </Row>
    <Row>
      <Input property={model.password} type="password" />
    </Row>
    <Actions>
      <Button label="Sign in" onClick={model.perform} />
    </Actions>
  </Form>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
