import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import type { Data } from './index.svelte.ts';
import { InputField } from './input.svelte.ts';
import { ValueFieldDefinition, type Optionals } from './value.svelte.ts';

export class StringField<D extends Data = Data> extends InputField<D, string> {}

export class StringFieldDefinition<D extends Data> extends ValueFieldDefinition<D, string, StringField<D>> {
  buildImpl(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>>) {
    return new StringField<D>({
      ...opts,
      toString: (value) => value,
      toValue: (value) => value,
    });
  }
}
