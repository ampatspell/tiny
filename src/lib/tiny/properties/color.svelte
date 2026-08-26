<script lang="ts">
  import type { Property } from '$lib/tiny/properties/property.svelte.js';
  import Container from './container.svelte';
  import Color from '$lib/tiny/color.svelte';

  let { property }: { property: Property<string> } = $props();

  let value = $derived(property.value);
  let onInput = (value: string) => property.update(value);
</script>

<Container {property}>
  <Color {value} {onInput} />
</Container>
