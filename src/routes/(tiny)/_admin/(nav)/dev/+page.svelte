<script lang="ts">
  import { FieldsDefinition } from '#lib/tiny/fields-3/index.svelte.js';
  import Json from '#lib/tiny/json.svelte';

  let definition = new FieldsDefinition({ data: { name: 'duck', hamsters: 5 } });
  let fields = definition.define(({ string, number }) => {
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
