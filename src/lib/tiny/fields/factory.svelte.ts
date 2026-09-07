import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any, ArrayKey, FileKey, NumberKey, StringKey } from '#lib/tiny/utils/utils.js';
import { ArrayFieldDefinition } from './array.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';
import type { FieldsDefinitionRecord } from './definitions.svelte.ts';
import { FileFieldDefinition, type FileFieldDefinitionOptions } from './file/file.svelte.ts';
import type { Data } from './index.svelte.ts';
import { NumberFieldDefinition, type NumberFieldDefinitionOptions } from './input/number.svelte.ts';
import {
  ColorFieldDefinition,
  StringFieldDefinition,
  type BaseStringFieldDefinitionOptions,
} from './input/string.svelte.ts';

type ArrayNestedData<D, K extends ArrayKey<D, Data>> = D[K] extends Any[] ? D[K][number] : never;
type Opts<T> = OptionsInput<Omit<T, 'key' | 'context'>>;

export type FactoryOptions = {
  context: FieldsContext;
};

export class Factory<D extends Data> {
  private readonly opts: FactoryOptions;
  readonly context = $derived.by(() => this.opts.context);

  constructor(opts: OptionsInput<FactoryOptions>) {
    this.opts = options(opts);
  }

  get defaults() {
    return {
      context: getter(() => this.context),
    };
  }

  readonly string = <K extends StringKey<D>>(key: K, opts?: Opts<BaseStringFieldDefinitionOptions>) => {
    return new StringFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly color = <K extends StringKey<D>>(key: K, opts?: Opts<BaseStringFieldDefinitionOptions>) => {
    return new ColorFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly number = <K extends NumberKey<D>>(key: K, opts?: Opts<NumberFieldDefinitionOptions>) => {
    return new NumberFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly file = <K extends FileKey<D>>(key: K, opts: Opts<FileFieldDefinitionOptions>) => {
    return new FileFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly array = <
    K extends ArrayKey<D, Data>,
    FDR extends FieldsDefinitionRecord<N>,
    N extends ArrayNestedData<D, K>,
  >(
    key: K,
    cb: (factory: Factory<N>) => FDR,
  ) => {
    return new ArrayFieldDefinition<D, N, FDR>({ key, ...this.defaults, cb });
  };
}
