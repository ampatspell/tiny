<script lang="ts">
  import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
  import Json from '#lib/tiny/json.svelte';

  let fields = withDataFields({ data: { name: 'duck', hamsters: 5 } }).define(({ string, number }) => {
    return {
      name: string('name'),
      hamsters: number('hamsters'),
    };
  });

  let ff = fields.record;
</script>

{ff.hamsters.data}
{ff.name.data}

<Json data={fields.serialized} />
