<script lang="ts">
  import type { Property } from '$lib/properties/property.svelte.js';
  import Container from './container.svelte';
  import Input from '$lib/components/input.svelte';

  let { property }: { property: Property<string> } = $props();

  let value = $derived(property.value);
  let onInput = (value: string) => property.update(value);
</script>

<Container {property}>
  <Input {value} {onInput} />
</Container>
