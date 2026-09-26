<script lang="ts">
  import { getDashboard } from '#lib/playground/dashboard/dashboard.remote.js';
  import { setDashboardContext, toPlainDate } from '#lib/playground/dashboard/dashboard.svelte.js';
  import Pills from '#lib/playground/dashboard/pills.svelte';
  import Content from '#lib/tiny/calendar/month/grid/content.svelte';
  import Header from '#lib/tiny/calendar/month/header.svelte';
  import Page from '#lib/tiny/page/page.svelte';
  import SplitView from '#lib/tiny/split-view.svelte';
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import { page } from '$app/state';

  let { children } = $props();

  let context = setDashboardContext();
  let data = $derived(await getDashboard());
  context.setup({
    data: getter(() => data),
  });

  let date = $derived.by(() => toPlainDate(page.params.date));
  let month = context.useMonth({ date: getter(() => date) });
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
        <Pills {date} />
      {/snippet}
    </Content>
  </SplitView>
</Page>
