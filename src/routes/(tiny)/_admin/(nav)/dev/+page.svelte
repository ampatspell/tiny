<script lang="ts">
  import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
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

{ff.hamsters.data}
{ff.name.data}
{ff.nicknames.data[0]?.nickname}

<Json data={fields.serialized} />
