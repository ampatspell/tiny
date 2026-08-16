<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Card from '$lib/components/card.svelte';
  import { useFloaters } from './models.svelte.ts';

  let floaters = useFloaters();

  let button = $state<Button>();
  let onClick = async () => {
    let floater = floaters.open({
      relative: () => button?.element,
      snippet: hey,
      request: {
        label: 'Hey there',
      },
      close: 'closed',
    });
    let res = await floater.response;
    console.log(res);
  };
</script>

{#snippet hey({
  request,
  resolve,
  close,
}: {
  request: { label: string };
  resolve: (resolution: string) => void;
  close: () => void;
})}
  <Card width="fit">
    <div class="floater">
      <div class="row">{request.label}</div>
      <div class="row">
        <Button label="Cancel" onClick={() => close()} />
        <Button label="Ok" onClick={() => resolve('ok')} />
      </div>
    </div>
  </Card>
{/snippet}

<div class="page">
  <div class="row">
    <Button bind:this={button} label="Open" {onClick} />
  </div>
</div>

<style lang="scss">
  .floater {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      flex-direction: row;
      gap: 5px;
    }
  }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
  }
</style>
