import type { Component } from 'svelte';
import type { Property } from '../properties/property.svelte.ts';
import { run, type Any } from '../utils/utils.ts';
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

export const serialize = run(() => {
  type Input = Record<string, Field>;
  type Output<I extends Input> = {
    [K in keyof I]: I[K]['serialized'];
  };

  const filtered = <I extends Input, O extends Output<I>>(input: I, filter: (field: Field) => boolean) => {
    const output = {} as Partial<O>;
    Object.keys(input).forEach((key) => {
      const field = input[key];
      if (filter(field)) {
        output[key as keyof I] = field.serialized as Any;
      }
    });
    return output;
  };

  const all = <I extends Input, O extends Output<I>>(input: I) => {
    return filtered<I, O>(input, () => true) as O;
  };

  const dirty = <I extends Input, O extends Output<I>>(input: I) => {
    const output = filtered<I, O>(input, (field) => field.property.isDirty);
    if (Object.keys(output).length) {
      return output;
    }
  };

  return {
    filtered,
    all,
    dirty,
  };
});
