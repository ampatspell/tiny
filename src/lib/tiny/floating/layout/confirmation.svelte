<script module lang="ts">
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
      reference: getter(() => opts.reference),
      position: basic(),
      close: false,
    }).response;
  };
</script>

<script lang="ts">
  import { basic } from '../position.ts';
  import Card from '#lib/tiny/card.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Label from '#lib/tiny/form/content/label.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Button from '#lib/tiny/button/button.svelte';
  import type { Floaters } from '../floaters/model.svelte.ts';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
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
