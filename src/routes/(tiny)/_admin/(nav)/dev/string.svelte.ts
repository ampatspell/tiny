import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { FieldDefinition, type FieldDefinitionBuildOptions } from './definition.svelte.ts';
import { Field } from './field.svelte.ts';
import type { Data } from './index.svelte.ts';

export class StringField<D extends Data = Data> extends Field<D, string> {
  readonly onInput = (next: string) => {
    this.update(next);
  };
}

export class StringFieldDefinition<D extends Data> extends FieldDefinition<D, string, StringField<D>> {
  build(opts: OptionsInput<FieldDefinitionBuildOptions<D>>) {
    return new StringField<D>(opts);
  }
}
