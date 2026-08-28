import type { Component } from 'svelte';
import type { Property } from '../properties/property.svelte.ts';
import type { Any } from '../utils/utils.ts';

export type Field<T = Any> = {
  property: Property<T>;
  component: Component<{ field: Any }>;
};
