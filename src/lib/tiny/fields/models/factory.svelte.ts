import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { ArrayKey, FileKey, NumberKey, OptionalId, StringKey } from '#lib/tiny/utils/utils.js';
import { ArrayFieldDefinition, type ArrayFieldDefinitionOptions, type Entry } from '../fields/array.svelte.ts';
import { ColorFieldDefinition } from '../fields/color.svelte.ts';
import { FileFieldDefinition, type FileFieldDefinitionOptions } from '../fields/file.svelte.ts';
import { NumberFieldDefinition, type NumberFieldDefinitionOptions } from '../fields/number.svelte.ts';
import { StringFieldDefinition, type StringFieldDefinitionOptions } from '../fields/string.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';
import type { Data } from './types.svelte.ts';

export type FactoryCallback<D extends Data, R extends Data> = (factory: Omit<Factory<D>, 'context' | 'record'>) => R;

export type FactoryOptions<D extends Data = Data, R extends Data = Data> = {
  context: FieldsContext;
  cb: FactoryCallback<D, R>;
};

type Opts<O> = OptionsInput<Omit<O, 'context' | 'key'>>;

export class Factory<D extends Data = Data, R extends Data = Data> {
  private readonly opts: FactoryOptions<D, R>;
  readonly context = $derived.by(() => this.opts.context);

  constructor(opts: OptionsInput<FactoryOptions<D, R>>) {
    this.opts = options(opts);
  }

  readonly record = $derived.by(() => this.opts.cb(this));

  private get base() {
    return {
      context: getter(() => this.context),
    };
  }

  readonly string = <K extends StringKey<D>>(key: K, opts?: Opts<StringFieldDefinitionOptions>) => {
    return new StringFieldDefinition({ key, ...this.base, ...opts });
  };

  readonly color = <K extends StringKey<D>>(key: K, opts?: Opts<StringFieldDefinitionOptions>) => {
    return new ColorFieldDefinition({ key, ...this.base, ...opts });
  };

  readonly number = <K extends NumberKey<D>>(key: K, opts?: Opts<NumberFieldDefinitionOptions>) => {
    return new NumberFieldDefinition({ key, ...this.base, ...opts });
  };

  readonly file = <K extends FileKey<D>>(key: K, opts?: Opts<FileFieldDefinitionOptions>) => {
    return new FileFieldDefinition({ key, ...this.base, ...opts });
  };

  readonly array = <K extends ArrayKey<D, Entry>, N extends OptionalId<InferArrayFieldType<D[K]>>, NR extends Data>(
    key: K,
    cb: FactoryCallback<N, NR>,
    opts?: Opts<Omit<ArrayFieldDefinitionOptions<N, NR>, 'cb'>>,
  ) => {
    return new ArrayFieldDefinition({ key, ...this.base, cb, ...opts });
  };
}

export type InferArrayFieldType<T> = T extends (infer E)[] ? (E extends Entry ? E : never) : never;
