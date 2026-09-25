<script lang="ts">
  import Content from '#lib/tiny/calendar/month/grid/content.svelte';
  import { useMonth } from '#lib/tiny/calendar/month/month.svelte.js';
  import { getter } from '#lib/tiny/utils/options.svelte.js';

  let date = $state<Temporal.PlainDate>();

  let month = useMonth({
    date: getter(() => date),
    onUpdate: (next) => (date = next),
  });
</script>

<div class="page">
  <Content {month}>
    {#snippet children({ date })}
      {date.isToday ? 'Today' : ''}
    {/snippet}
  </Content>
</div>

<style lang="scss">
  .page {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 50px;
  }
</style>
