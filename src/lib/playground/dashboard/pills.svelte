<script lang="ts">
  import Pill from '#lib/tiny/calendar/month/grid/pills/pill.svelte';
  import Pills from '#lib/tiny/calendar/month/grid/pills/pills.svelte';
  import { pluralize } from '#lib/tiny/utils/string.js';

  let {
    date,
    files,
  }: {
    date: Temporal.PlainDate;
    files: {
      createdAt: Temporal.ZonedDateTime;
      id: string;
      name: string;
    }[];
  } = $props();

  let filtered = $derived(files.filter((file) => file.createdAt.toPlainDate().equals(date)));
  let pills = $state<Pills>();
  let max = $derived(pills?.max ?? Infinity);
</script>

<Pills bind:this={pills}>
  {#if filtered.length && max > 0}
    <Pill label={`Uploaded ${files.length} ${pluralize(filtered.length, 'file', 'files')}`} />
  {/if}
</Pills>
