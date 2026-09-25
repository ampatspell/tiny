<script lang="ts">
  import { getter } from '#lib/tiny/utils/options.svelte.js';
  import Content from './content.svelte';
  import Header from './header.svelte';
  import { useMonth } from '../month.svelte.ts';

  let {
    date,
    onUpdate,
  }: {
    date: Temporal.PlainDate | undefined;
    onUpdate: (date: Temporal.PlainDate) => void;
  } = $props();

  let month = useMonth({
    date: getter(() => date),
    onUpdate: getter(() => onUpdate),
  });
</script>

<div class="month">
  <Header {month} />
  <Content {month} />
</div>

<style lang="scss">
  .month {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 5px;
  }
</style>
