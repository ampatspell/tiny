<script lang="ts">
  import Card from '$lib/components/card.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Header from '$lib/components/form/header.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Button from '$lib/components/button/button.svelte';
  import Actions from '$lib/components/form/actions.svelte';
  import { widow } from '$lib/utils/string.js';

  let { onDone }: { onDone: (confirmed: boolean) => void } = $props();
</script>

<Card width="fit">
  <Form>
    <Header title="Delete gallery" />
    <Content>
      <Row>{widow('Sure you want to delete this gallery?')}</Row>
    </Content>
    <Actions>
      <Button label="Cancel" onClick={() => onDone(false)} />
      <Button label="Delete" onClick={() => onDone(true)} />
    </Actions>
  </Form>
</Card>
