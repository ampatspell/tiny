<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
  import Fields from '#lib/tiny/fields-3/fields.svelte';
  import Actions from '#lib/tiny/form/actions.svelte';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';

  let fields = withDataFields({
    data: {
      ducks: [
        {
          id: '0',
          name: 'Yellow',
          hamsters: 3,
        },
        {
          id: '1',
          name: 'Green',
          hamsters: 1,
        },
        {
          id: '2',
          name: 'Orange',
          hamsters: 0,
        },
      ],
    },
  }).define(({ array }) => {
    return {
      ducks: array('ducks', ({ string, number }) => {
        return {
          name: string('name'),
          hamsters: number('hamsters'),
        };
      }),
    };
  });

  let onSave = () => {
    if (fields.touch()) {
      console.log('save', fields.serialized);
    }
  };

  let onRollback = () => fields.rollback();

  let onAdd = () => fields.record.ducks.add({ name: 'New', hamsters: 0 });
</script>

{#each fields.record.ducks.items as item (item)}
  <div class={['item', item.isDeleted && 'deleted']}>
    <Form>
      <Content>
        <Fields fields={[item.record.name, item.record.hamsters]} />
      </Content>
      <Actions>
        <Button label="Rollback" onClick={() => item.rollback()} isDisabled={!item.isDirty || item.isDeleted} />
        <Button label="Delete" onClick={() => item.delete()} isDisabled={item.isDeleted} />
        <Button label="Restore" onClick={() => item.restore()} isDisabled={!item.isDeleted} />
      </Actions>
    </Form>
  </div>
{/each}

<Form>
  <Content>
    <Row>
      <Button label="Add" onClick={onAdd} />
    </Row>
  </Content>
</Form>

<Form>
  <Content>
    <Row>
      <Button label="Save" onClick={onSave} />
      <Button label="Rollback" onClick={onRollback} />
    </Row>
  </Content>
</Form>

<style lang="scss">
  .item {
    &.deleted {
      opacity: 0.2;
    }
  }
</style>
