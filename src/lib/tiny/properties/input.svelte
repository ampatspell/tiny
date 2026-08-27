<script lang="ts">
  import type { Property } from '$lib/tiny/properties/property.svelte.js';
  import Container from './container.svelte';
  import Input, { type InputType } from '$lib/tiny/input.svelte';

  let { property, type }: { property: Property<string>; type?: InputType } = $props();

  let value = $derived(property.value);
  let onInput = (value: string) => property.update(value);
</script>

<Container {property}>
  <Input {value} {onInput} {type} />
</Container>
