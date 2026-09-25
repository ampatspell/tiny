<script lang="ts">
  import Container from '../container.svelte';
  import type { DateField } from './date.svelte.ts';
  import Date from '../../date.svelte';

  let { field }: { field: DateField } = $props();

  let date = $derived(field.date);
  let onUpdate = (date: Temporal.PlainDate | undefined) => field.onUpdate(date);
</script>

<Container {field}>
  <Date {date} {onUpdate} />
</Container>
