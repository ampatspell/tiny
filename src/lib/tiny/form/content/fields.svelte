<script lang="ts">
  import type { Field as FieldType } from '$lib/tiny/fields/utils.svelte.js';
  import Field from '$lib/tiny/fields/field.svelte';
  import Row from './row.svelte';

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
