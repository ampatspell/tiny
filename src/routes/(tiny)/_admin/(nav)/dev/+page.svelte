<script lang="ts">
  import Header from '#lib/tiny/calendar/header.svelte';
  import { useMonth } from '#lib/tiny/calendar/models.svelte.js';
  import Month from '#lib/tiny/calendar/month.svelte';
  import Card from '#lib/tiny/card.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';

  let date = $state<Temporal.PlainDate>();
  let onUpdate = (next: Temporal.PlainDate) => {
    date = next;
  };

  let month = useMonth({
    date: getter(() => date),
    onUpdate: getter(() => onUpdate),
  });
</script>

<div class="dev">
  <Card width="fit">
    <div class="content">
      <Header {month} />
      <Month {month} />
    </div>
  </Card>
</div>

<style lang="scss">
  .dev {
    padding: 50px;
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 5px;
    }
  }
</style>
