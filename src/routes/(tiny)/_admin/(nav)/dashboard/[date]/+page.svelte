<script lang="ts">
  import { toPlainDate, useDashboardContext } from '#lib/playground/dashboard/dashboard.svelte.js';
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Label from '#lib/tiny/form/content/label.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import TablerCircleX from '#lib/tiny/icons/tabler--circle-x.svelte';
  import Page from '#lib/tiny/page/page.svelte';
  import { page } from '$app/state';

  let context = useDashboardContext();
  let date = $derived(context.createOptionalDate(toPlainDate(page.params.date)));
</script>

<Page label={page.params.date}>
  {#snippet accessories()}
    <Button variant="light" type="link" route={context.root}>
      <Icon icon={TablerCircleX} />
    </Button>
  {/snippet}
  {#if date}
    <Form>
      <Content>
        {#each date.files as file (file.id)}
          <Row><Label value={file.name} /></Row>
        {/each}
      </Content>
    </Form>
  {/if}
</Page>
