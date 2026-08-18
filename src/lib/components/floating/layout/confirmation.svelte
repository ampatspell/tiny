<script module lang="ts">
  import { type Floaters } from '../floaters.svelte.ts';

  type ConfirmOptions = {
    floaters: Floaters;
    reference: HTMLElement;
    title: string;
    description: string;
    cancel?: string;
    confirm: string;
  };

  export const confirm = async (opts: ConfirmOptions) => {
    return await opts.floaters.open({
      snippet,
      request: opts,
      reference: () => opts.reference,
      position: basic,
      close: false,
    }).response;
  };
</script>

<script lang="ts">
  import Card from '$lib/components/card.svelte';
  import Form from '$lib/components/form/form.svelte';
  import Header from '$lib/components/form/header.svelte';
  import Content from '$lib/components/form/content/content.svelte';
  import Row from '$lib/components/form/content/row.svelte';
  import Button from '$lib/components/button/button.svelte';
  import Actions from '$lib/components/form/actions.svelte';
  import Label from '$lib/components/form/content/label.svelte';
  import { basic } from '../position.ts';
</script>

{#snippet snippet({ request, resolve }: { request: ConfirmOptions; resolve: (ok: boolean) => void })}
  <Card width="fit">
    <Form>
      <Header title={request.title} />
      <Content>
        <Row>
          <Label value={request.description} />
        </Row>
      </Content>
      <Actions>
        <Button label={request.cancel ?? 'Cancel'} onClick={() => resolve(false)} />
        <Button label={request.confirm} onClick={() => resolve(true)} />
      </Actions>
    </Form>
  </Card>
{/snippet}
