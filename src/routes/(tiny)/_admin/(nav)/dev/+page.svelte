<script lang="ts">
  import Content from '#lib/tiny/calendar/month/grid/content.svelte';
  import Pill from '#lib/tiny/calendar/month/grid/pills/pill.svelte';
  import Pills from '#lib/tiny/calendar/month/grid/pills/pills.svelte';
  import { useMonth } from '#lib/tiny/calendar/month/month.svelte.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import Page from '#lib/tiny/page/page.svelte';
  import Header from '#lib/tiny/calendar/month/header.svelte';

  let date = $state<Temporal.PlainDate>();

  let month = useMonth({
    date: getter(() => date),
    onUpdate: (next) => (date = next),
  });
</script>

<Page label="Calendar">
  {#snippet navigation()}
    <Header {month} />
  {/snippet}
  <Content {month}>
    {#snippet date({ date })}
      <Pills>
        <Pill label={date.isToday ? 'Today' : undefined} />
      </Pills>
    {/snippet}
  </Content>
</Page>
