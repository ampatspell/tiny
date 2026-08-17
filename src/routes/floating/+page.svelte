<script lang="ts">
  import Button from '$lib/components/button/button.svelte';
  import Card from '$lib/components/card.svelte';
  import { useFloaters } from '$lib/components/floating/floaters.svelte.js';
  import { basic } from '$lib/components/floating/position.js';
  import Tooltip from '$lib/components/floating/tooltip.svelte';

  let floaters = useFloaters();

  let button = $state<Button>();
  let onClick = async () => {
    let floater = floaters.open({
      reference: () => button?.element,
      position: basic,
      snippet: hey,
      request: {
        label: 'Hey there. This floats.',
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
      <div class="row actions">
        <Button label="Cancel" onClick={() => close()} />
        <Button label="Ok" onClick={() => resolve('ok')} />
      </div>
    </div>
  </Card>
{/snippet}

<div class="page">
  <div class="row">
    <Tooltip label="Now with tooltips" placement="right">
      <Button bind:this={button} label="Open floater" {onClick} />
    </Tooltip>
  </div>
</div>

<style lang="scss">
  .floater {
    width: 200px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    > .row {
      display: flex;
      flex-direction: row;
      gap: 5px;
      &.actions {
        justify-content: flex-end;
      }
    }
  }

  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 25px;
  }
</style>
