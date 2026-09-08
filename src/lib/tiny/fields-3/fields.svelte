<script lang="ts">
  import Row from '#lib/tiny/form/content/row.svelte';
  import Field from './field.svelte';
  import type { Field as FieldType } from './field.svelte.ts';

  type Props =
    | {
        field: FieldType;
      }
    | {
        fields: FieldType[];
      };

  let props: Props = $props();
</script>

{#if 'fields' in props}
  <Row>
    {#each props.fields as field (field)}
      <Field {field} />
    {/each}
  </Row>
{:else if 'field' in props}
  <Row>
    <Field field={props.field} />
  </Row>
{/if}
