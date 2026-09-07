import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import type { ArrayKey, NumberKey, StringKey } from '../utils/utils.ts';
import { ArrayFieldDefinition } from './array-field.svelte.ts';
import type { FieldsContext } from './context.svelte.ts';
import type { BaseFieldDefinitionOptions } from './field-definition.svelte.ts';
import { NumberFieldDefinition } from './number-field.svelte.ts';
import { StringFieldDefinition } from './string-field.svelte.ts';
import type { Data } from './types.svelte.ts';

export type FactoryOptions<D extends Data = Data, R extends Data = Data> = {
  context: FieldsContext;
  cb: (factory: Factory<D>) => R;
};

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

  readonly string = <K extends StringKey<D>>(key: K, opts?: OptionsInput<BaseFieldDefinitionOptions>) => {
    return new StringFieldDefinition({ key, ...this.base, ...opts });
  };

  // TODO: color

  readonly number = <K extends NumberKey<D>>(key: K, opts?: OptionsInput<BaseFieldDefinitionOptions>) => {
    return new NumberFieldDefinition({ key, ...this.base, ...opts });
  };

  // TODO: file

  readonly array = <K extends ArrayKey<D, Data>>(key: K, opts?: OptionsInput<BaseFieldDefinitionOptions>) => {
    return new ArrayFieldDefinition<InferArrayFieldType<D[K]>>({ key, ...this.base, ...opts });
  };
}

export type InferArrayFieldType<T> = T extends (infer E)[] ? (E extends Data ? E : never) : never;
