<script lang="ts">
  import { FieldsDefinition } from '#lib/tiny/fields-3/index.svelte.js';

  let definition = new FieldsDefinition({ data: { name: 'duck', hamsters: 5 } });
  let fields = definition.define(({ string, number }) => {
    return {
      name: string('name'),
      hamsters: number('hamsters'),
    };
  });

  let ff = fields.record;
</script>

{ff.hamsters.external}
{ff.name.external}
