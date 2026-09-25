<script lang="ts">
  import Month from '#lib/tiny/calendar/month.svelte';
  import Card from '#lib/tiny/card.svelte';

  let date = $state(Temporal.Now.plainDateISO());
  let onUpdate = (next: Temporal.PlainDate) => {
    date = next;
  };
</script>

<div class="dev">
  <Card width="fit">
    <Month {date} {onUpdate} />
  </Card>
</div>

<style lang="scss">
  .dev {
    padding: 50px;
  }
</style>
