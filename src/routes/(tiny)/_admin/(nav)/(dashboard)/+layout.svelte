<script lang="ts">
  import { getDashboard } from '#lib/playground/dashboard/dashboard.remote.js';
  import Pills from '#lib/playground/dashboard/pills.svelte';
  import Content from '#lib/tiny/calendar/month/grid/content.svelte';
  import Header from '#lib/tiny/calendar/month/header.svelte';
  import { useMonth } from '#lib/tiny/calendar/month/month.svelte.js';
  import Page from '#lib/tiny/page/page.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { Any } from '#lib/tiny/utils/utils.js';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';

  let { children } = $props();

  let data = $derived(await getDashboard());

  let files = $derived.by(() => {
    return data.files.map((data) => {
      let createdAt = Temporal.PlainDateTime.from(data.createdAt).toZonedDateTime('UTC').withTimeZone('Europe/Riga');
      return {
        ...data,
        createdAt,
      };
    });
  });

  let date = $derived.by(() => {
    let string = page.params.date;
    if (string) {
      try {
        return Temporal.PlainDate.from(string);
      } catch (e: Any) {
        console.log(e.message);
      }
    }
  });

  let month = useMonth({
    date: getter(() => date),
    onUpdate: (next) => {
      if (next) {
        goto(resolve('/(tiny)/_admin/(nav)/(dashboard)/[date]', { date: next.toJSON() }));
      }
    },
  });
</script>

<Page label="Calendar">
  {#snippet navigation()}
    <Header {month} />
  {/snippet}
  <SplitView variant="reverse">
    {#snippet sidebar()}
      {@render children()}
    {/snippet}
    <Content {month}>
      {#snippet date({ date })}
        <Pills {date} {files} />
      {/snippet}
    </Content>
  </SplitView>
</Page>
