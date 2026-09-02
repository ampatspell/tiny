import type { Component } from 'svelte';
import type { Property } from '../properties/property.svelte.ts';
import { type Any } from '../utils/utils.ts';
import { getter, options } from '../utils/options.svelte.ts';

export type Field<T = Any, S = T> = {
  property: Property<T>;
  component: Component<{ field: Any }>;
  serialized: S;
  meta: {
    isRequired: boolean;
    label?: string | undefined;
    description?: string | undefined;
  };
};

export type BaseFieldOptions = Partial<{
  meta: Partial<{
    label: string;
    description: string;
  }>;
}>;

export type FieldOptions<T> = { property: Property<T> } & BaseFieldOptions;

export const createMeta = <T>(opts: FieldOptions<T>) => {
  return options(
    {
      isRequired: getter(() => opts.property.meta.isRequired),
      label: getter(() => opts.meta?.label),
      description: getter(() => opts.meta?.description),
    },
    { name: 'FieldMeta' },
  );
};
