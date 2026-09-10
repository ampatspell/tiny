<script lang="ts" generics="L extends ArrayGridEditingLayout">
  import Button from '#lib/tiny/button/button.svelte';
  import Icon from '#lib/tiny/button/icon.svelte';
  import Label from '#lib/tiny/button/label.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import TablerPhoto from '#lib/tiny/icons/tabler--photo.svelte';
  import TablerSquareRoundedPlus from '#lib/tiny/icons/tabler--square-rounded-plus.svelte';
  import Section from '#lib/tiny/page/section.svelte';
  import Placeholder from '#lib/tiny/placeholder.svelte';
  import type { Snippet } from 'svelte';
  import type { ArrayGridEditingLayout, InferItemFromLayout } from './layout.svelte.ts';

  type I = InferItemFromLayout<L>;

  let {
    layout,
    selected: selectedSnippet,
  }: {
    layout: L;
    selected: Snippet<[{ item: I }]>;
  } = $props();

  let field = $derived(layout.field);
  let selected = $derived(layout.selected);

  let onAdd = $derived(layout.onAdd);
  let onClear = () => layout.field?.clear();
  let onRestore = () => layout.field?.restore();
</script>

{#if field}
  <Section height="fill">
    {#if selected}
      <Form>
        <Content>
          {@render selectedSnippet({ item: selected as I })}
          <Row>
            {#if selected.isDeleted}
              <Button variant="light" label="Restore" onClick={() => selected.restore()} />
            {:else}
              <Button variant="light" label="Delete" onClick={() => selected.delete()} />
            {/if}
          </Row>
        </Content>
      </Form>
    {:else}
      <Placeholder icon={TablerPhoto} label="No selection" />
    {/if}
  </Section>
  <Section>
    <Form>
      <Content>
        <Row>
          {#if onAdd}
            <Button onClick={onAdd}>
              <Icon icon={TablerSquareRoundedPlus} />
              <Label>Add files</Label>
            </Button>
          {/if}
          {#if field.items.length}
            {#if field.existing.length}
              <Button variant="light" label="Delete all" onClick={onClear} />
            {:else}
              <Button variant="light" label="Restore" onClick={onRestore} />
            {/if}
          {/if}
        </Row>
      </Content>
    </Form>
  </Section>
{/if}
