import type { Component } from 'svelte';
import type { Property } from '../properties/property.svelte.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type Field<T> = {
  property: Property<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Component<{ field: any }>;
};
