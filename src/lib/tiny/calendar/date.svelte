<script lang="ts">
  import Card from '../card.svelte';
  import Chevron from '../dropdown/content/chevron.svelte';
  import Clickable from '../dropdown/content/clickable.svelte';
  import Item from '../dropdown/content/item.svelte';
  import Label from '../dropdown/content/label.svelte';
  import { basic } from '../floating/position.ts';
  import Month from './month/month.svelte';

  let {
    date,
    onUpdate: _onUpdate,
  }: {
    date: Temporal.PlainDate | undefined;
    onUpdate: (date: Temporal.PlainDate) => void;
  } = $props();

  let onUpdate = (close: () => void) => {
    return (date: Temporal.PlainDate) => {
      _onUpdate(date);
      close();
    };
  };

  let label = $derived.by(() => {
    if (date) {
      return date.toJSON();
    }
  });

  let position = basic({
    offset: {
      mainAxis: 3,
    },
  });
</script>

<Clickable {position}>
  {#snippet content({ close })}
    <Card variant="smaller" width="fit">
      <Month {date} onUpdate={onUpdate(close)} />
    </Card>
  {/snippet}
  {#snippet children({ open, isOpen })}
    <Item onClick={open} variant="bordered">
      <Label {label} />
      <Chevron {isOpen} />
    </Item>
  {/snippet}
</Clickable>
