import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { Any, ArrayKey, FileKey, NumberKey, StringKey } from '#lib/tiny/utils/utils.js';
import { ArrayFieldDefinition } from './array.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';
import type { FieldDefinitionsRecord } from './definitions.svelte.ts';
import { FileFieldDefinition, type FileFieldDefinitionOptions } from './file.svelte.ts';
import type { Data } from './index.svelte.ts';
import { NumberFieldDefinition } from './number.svelte.ts';
import { StringFieldDefinition } from './string.svelte.ts';
import type { ValueFieldDefinitionOptions } from './value.svelte.ts';

type ArrayNestedData<D, K extends ArrayKey<D, Data>> = D[K] extends Any[] ? D[K][number] : never;

type ValueOpts<T> = OptionsInput<Omit<ValueFieldDefinitionOptions<T>, 'key' | 'context'>>;
type FileOpts = OptionsInput<Omit<FileFieldDefinitionOptions, 'key' | 'context'>>;

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

  readonly string = <K extends StringKey<D>>(key: K, opts?: ValueOpts<string>) => {
    return new StringFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly number = <K extends NumberKey<D>>(key: K, opts?: ValueOpts<number>) => {
    return new NumberFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly file = <K extends FileKey<D>>(key: K, opts: FileOpts) => {
    return new FileFieldDefinition<D>({ key, ...this.defaults, ...opts });
  };

  readonly array = <
    K extends ArrayKey<D, Data>,
    FDR extends FieldDefinitionsRecord<N>,
    N extends ArrayNestedData<D, K>,
  >(
    key: K,
    cb: (factory: Factory<N>) => FDR,
  ) => {
    return new ArrayFieldDefinition<D, N, FDR>({ key, ...this.defaults, cb });
  };
}
