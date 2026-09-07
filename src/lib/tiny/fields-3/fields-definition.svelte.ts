import { getter, options, type OptionsInput } from '../utils/options.svelte.ts';
import { FieldsContext } from './context.svelte.ts';
import { Factory } from './factory.svelte.ts';
import { Fields } from './fields.svelte.ts';
import type { Data } from './types.svelte.ts';

export type FieldsDefinitionOptions<D extends Data = Data> = {
  data: D;
  context?: FieldsContext;
};

export class FieldsDefinition<D extends Data = Data> {
  private readonly opts: FieldsDefinitionOptions<D>;

  readonly data = $derived.by(() => this.opts.data);
  readonly context = $derived.by(() => this.opts.context ?? new FieldsContext());

  constructor(opts: OptionsInput<FieldsDefinitionOptions<D>>) {
    this.opts = options(opts);
  }

  factory<R extends Data>(cb: (factory: Factory<D>) => R) {
    return new Factory({
      cb,
      context: getter(() => this.context),
    });
  }

  define<R extends Data>(cb: (factory: Factory<D>) => R) {
    const factory = this.factory(cb);
    return new Fields({
      data: getter(() => this.opts.data),
      factory,
    });
  }
}

export const withDataFields = <D extends Data = Data>(...opts: ConstructorParameters<typeof FieldsDefinition<D>>) => {
  return new FieldsDefinition(...opts);
};
