<script lang="ts">
  import Content from '#lib/tiny/calendar/month/grid/content.svelte';
  import Pill from '#lib/tiny/calendar/month/grid/pills/pill.svelte';
  import Pills from '#lib/tiny/calendar/month/grid/pills/pills.svelte';
  import { useMonth } from '#lib/tiny/calendar/month/month.svelte.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import Page from '#lib/tiny/page/page.svelte';
  import Header from '#lib/tiny/calendar/month/header.svelte';
  import { getFiles } from './files.remote.ts';
  import { pluralize } from '#lib/tiny/utils/string.js';

  let data = $derived(await getFiles());

  let files = $derived.by(() => {
    return data.map((data) => {
      let createdAt = Temporal.PlainDateTime.from(data.createdAt).toZonedDateTime('UTC').withTimeZone('Europe/Riga');
      return {
        ...data,
        createdAt,
      };
    });
  });

  let filesFor = (date: Temporal.PlainDate) => {
    return files.filter((file) => file.createdAt.toPlainDate().equals(date));
  };

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
        <Pill deg={200} label={date.isToday ? 'Today' : undefined} />
        {@const f = filesFor(date.date)}
        {#if f.length}
          <Pill label={`Uploaded ${f.length} ${pluralize(f.length, 'file', 'files')}`} />
        {/if}
      </Pills>
    {/snippet}
  </Content>
</Page>
