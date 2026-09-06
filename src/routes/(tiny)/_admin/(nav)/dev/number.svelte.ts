import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';
import { ValueField, ValueFieldDefinition, type Optionals } from './value.svelte.ts';

export class NumberField<D extends Data> extends ValueField<D, number> {}

export class NumberFieldDefinition<D extends Data> extends ValueFieldDefinition<D, number, NumberField<D>> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<number>>) {
    return new NumberField<D>(opts);
  }
}
