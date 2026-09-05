<script lang="ts" generics="A">
  import Json from '#lib/tiny/json.svelte';
  import Container from '../container.svelte';
  import type { ArrayField } from './field.svelte.ts';

  let { field }: { field: ArrayField<A> } = $props();

  let property = $derived(field.property);
</script>

<Container {field}>
  <Json data={property.value} />
</Container>
