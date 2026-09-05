import { sentenceCase } from 'text-sentence-case';
import {
  withDataProperties,
  type Data,
  type DataPropertiesState,
  type WithDataOptions,
} from '../properties/data.svelte.ts';
import type { Property, UsePropertyOptions } from '../properties/property.svelte.ts';
import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { BaseFieldOptions, Field } from './utils.svelte.ts';
import { run, type Any, type ArrayKey, type FileKey, type NumberKey, type StringKey } from '../utils/utils.ts';
import type { UniversalFile } from '../files.svelte.ts';
import { colorField, stringField } from './input/field.svelte.ts';
import { numberField } from './input/number.svelte.ts';
import { fileField } from './file/field.svelte.ts';
import type { InputType } from '../input.svelte';
import { arrayField } from './array/field.svelte.ts';

export type Fields = Record<string, Field>;

export type Serialized<I extends Fields> = {
  [K in keyof I]: I[K]['serialized'];
};

const filtered = <I extends Fields, O extends Serialized<I>>(input: I, filter: (field: Field) => boolean) => {
  const output = {} as Partial<O>;
  Object.keys(input).forEach((key) => {
    const field = input[key];
    if (filter(field)) {
      output[key as keyof I] = field.serialized as Any;
    }
  });
  return output;
};

const serializeAll = <I extends Fields, O extends Serialized<I>>(input: I) => {
  return filtered<I, O>(input, () => true) as O;
};

const serializeDirty = <I extends Fields, O extends Serialized<I>>(input: I) => {
  const output = filtered<I, O>(input, (field) => field.property.isDirty);
  if (Object.keys(output).length) {
    return output;
  }
};

const createFactoryAndState = <D extends Data = Data>(_opts: OptionsInput<WithDataOptions<D>>) => {
  const properties = withDataProperties<D>(_opts);
  const fields: { key: keyof D; field: Field }[] = [];

  const createFactory = (
    createDataProperty: Parameters<Parameters<(typeof properties)['define']>[0]>[0]['property'],
  ) => {
    type PropertyOptions<K extends keyof D> = Omit<UsePropertyOptions<D[K]>, 'value' | 'context'>;
    type FieldOptions<K extends keyof D> = PropertyOptions<K> & BaseFieldOptions;

    const as = <T>(property: Property<Any>): Property<T> => {
      return property as Property<T>;
    };

    const split = <K extends keyof D>(key: string, opts?: FieldOptions<K>) => {
      const { willUpdate, didUpdate, meta, onRollback, passive, validator } = opts ?? {};
      return {
        property: {
          willUpdate,
          didUpdate,
          onRollback,
          passive,
          validator,
        },
        field: {
          meta: { label: sentenceCase(key), ...meta },
        },
      };
    };

    const add = <F extends Field>(key: keyof D, field: F): F => {
      fields.push({ key, field });
      return field;
    };

    const string = <K extends StringKey<D>>(key: K, _opts?: FieldOptions<K> & { type?: InputType }) => {
      const opts = split(key, _opts);
      const property = as<string>(createDataProperty(key, opts.property));
      return add(key, stringField({ property, ...opts.field, type: _opts?.type }));
    };

    const color = <K extends StringKey<D>>(key: K, _opts?: FieldOptions<K>) => {
      const opts = split(key, _opts);
      const property = as<string>(createDataProperty(key, opts.property));
      return add(key, colorField({ property, ...opts.field }));
    };

    const number = <K extends NumberKey<D>>(key: K, _opts?: FieldOptions<K>) => {
      const opts = split(key, _opts);
      const property = as<number>(createDataProperty(key, opts.property));
      return add(key, numberField({ property, ...opts.field }));
    };

    const file = <K extends FileKey<D>>(key: K, _opts: FieldOptions<K> & { accept: string[] }) => {
      const opts = split(key, _opts);
      const property = as<UniversalFile | undefined>(createDataProperty<K>(key, opts.property));
      return add(key, fileField({ property, ...opts.field, accept: _opts.accept }));
    };

    const array = <K extends ArrayKey<D, object>>(key: K, _opts?: FieldOptions<K>) => {
      type A = D[K] extends Data[] ? D[K] : never;
      const opts = split(key, _opts);
      const property = as<A>(createDataProperty<K>(key, opts.property));
      const field = arrayField<A>({ property, ...opts.field });
      return {
        define: (cb: (factory: Factory) => void) => {
          return field;
        },
      };
    };

    return {
      string,
      number,
      color,
      file,
      array,
    };
  };

  const createState = <R extends Fields>(fields: R, props: DataPropertiesState) => {
    const isDirty = getter(() => props.isDirty);
    const touch = () => props.touch();
    const rollback = () => props.rollback();
    const serialized = run(() => {
      const all = $derived(serializeAll(fields));
      const dirty = $derived(serializeDirty(fields));
      return options({
        all: getter(() => all),
        dirty: getter(() => dirty),
      });
    });
    return options(
      {
        isDirty,
        isValid: getter(() => props.isDirty),
        isTouched: getter(() => props.isDirty),
        serialized,
        touch,
        rollback,
        opts: {
          isDirty,
          rollback,
        },
      },
      {
        name: 'DataFieldsState',
      },
    );
  };

  type Factory = ReturnType<typeof createFactory>;
  type State<R extends Fields> = ReturnType<typeof createState<R>>;

  return <R extends Fields>(cb: (arg: Factory) => R): [R, State<R>] => {
    const parent = properties.create();
    const f = createFactory(parent.factory.property);
    const object = cb(f);
    const state = createState<R>(object, parent.state);
    return [object, state];
  };
};

export const withDataFields = <D extends Data = Data>(_opts: OptionsInput<WithDataOptions<D>>) => {
  const define = createFactoryAndState<D>(_opts);

  return {
    define,
  };
};

export type DataFieldsState = ReturnType<ReturnType<typeof withDataFields>['define']>[1];
