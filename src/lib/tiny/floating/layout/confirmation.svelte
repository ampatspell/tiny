<script module lang="ts">
  type ConfirmOptions = {
    floaters: Floaters;
    title: string;
    description?: string;
    cancel?: string;
    confirm: string;
  } & (
    | {
        type?: 'relative';
        reference: HTMLElement;
      }
    | {
        type: 'center';
      }
  );

  export const confirm = async (request: ConfirmOptions) => {
    let reference;
    let position;
    if ('type' in request && request.type === 'center') {
      reference = document.body;
      position = center();
    } else {
      reference = request.reference;
      position = basic();
    }
    return await request.floaters.open({
      snippet,
      request,
      reference,
      position,
      close: false,
    }).response;
  };
</script>

<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import Card from '#lib/tiny/card.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Label from '#lib/tiny/form/content/label.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Header from '#lib/tiny/form/header.svelte';
  import type { Floaters } from '../floaters/model.svelte.ts';
  import { basic, center } from '../position.ts';
</script>

{#snippet snippet({ request, resolve }: { request: ConfirmOptions; resolve: (ok: boolean) => void })}
  <Card width="fit">
    <Form>
      <Header title={request.title} />
      {#if request.description}
        <Content>
          <Row>
            <Label value={request.description} />
          </Row>
        </Content>
      {/if}
      <Actions>
        <Button label={request.cancel ?? 'Cancel'} onClick={() => resolve(false)} />
        <Button label={request.confirm} onClick={() => resolve(true)} />
      </Actions>
    </Form>
  </Card>
{/snippet}
