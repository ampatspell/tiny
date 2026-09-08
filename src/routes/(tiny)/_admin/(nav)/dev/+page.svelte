<script lang="ts">
  import Button from '#lib/tiny/button/button.svelte';
  import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';

  let fields = withDataFields({
    data: {
      name: 'duck',
      hamsters: 5,
      file: undefined,
      nicknames: [
        {
          id: '0',
          nickname: 'yellow',
        },
      ],
    },
  }).define(({ array }) => {
    return {
      nicknames: array('nicknames'),
    };
  });

  let onSave = () => {
    if (fields.touch()) {
      console.log('save', fields.serialized);
    }
  };

  let onRollback = () => fields.rollback();
</script>

<Form>
  <Content>
    <Row>Dirty: {fields.isDirty}</Row>
    <Row>Valid: {fields.isValid}</Row>
    <Row>Touched: {fields.isTouched}</Row>
    <Row>
      <Button label="Save" onClick={onSave} />
      <Button label="Rollback" onClick={onRollback} />
    </Row>
  </Content>
</Form>
