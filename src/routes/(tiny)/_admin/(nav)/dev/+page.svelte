<script lang="ts">
  import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
  import Content from '#lib/tiny/form/content/content.svelte';
  import Row from '#lib/tiny/form/content/row.svelte';
  import Form from '#lib/tiny/form/form.svelte';
  import Json from '#lib/tiny/json.svelte';

  let fields = withDataFields({
    data: {
      name: 'duck',
      hamsters: 5,
      nicknames: [
        {
          id: '0',
          nickname: 'yellow',
        },
      ],
    },
  }).define(({ string, number, array }) => {
    return {
      name: string('name'),
      hamsters: number('hamsters'),
      nicknames: array('nicknames'),
    };
  });

  let ff = fields.record;
</script>

<Form>
  <Content>
    <Row>{ff.hamsters.data}</Row>
    <Row>{ff.name.data}</Row>
    <Row>{ff.nicknames.data[0]?.nickname}</Row>
    <Row><Json data={fields.serialized} /></Row>
  </Content>
</Form>
