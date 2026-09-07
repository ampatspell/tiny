import type { OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import type { FieldDefinitionBuildOptions } from '../definition.svelte.ts';
import type { Data } from '../index.svelte.ts';
import { type Optionals } from '../value.svelte.ts';
import ColorEditor from './color-editor.svelte';
import InputEditor from './input-editor.svelte';
import { InputField, InputFieldDefinition, type InputFieldDefinitionOptions, type Shared } from './input.svelte.ts';

export abstract class BaseStringField<D extends Data = Data> extends InputField<D, string> {
  readonly string = $derived(this.value);
  readonly serialized = $derived(this.value);
  readonly onInput = (next: string) => this.update(next);
  readonly onBlur = () => {};
}

export type BaseStringFieldDefinitionOptions = InputFieldDefinitionOptions<string>;

export abstract class BaseStringFieldDefinition<D extends Data> extends InputFieldDefinition<
  D,
  string,
  BaseStringField<D>,
  BaseStringFieldDefinitionOptions
> {
  protected valueField(opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>>) {
    const { type } = this.raw;
    return this.buildStringImpl({ ...opts, type });
  }

  protected abstract buildStringImpl(
    opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>> & OptionsInput<Shared>,
  ): BaseStringField<D>;
}

export class StringField<D extends Data> extends BaseStringField<D> {
  protected readonly editor = InputEditor;
}

export class StringFieldDefinition<D extends Data> extends BaseStringFieldDefinition<D> {
  protected buildStringImpl(
    opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>> & OptionsInput<Shared>,
  ) {
    return new StringField<D>(opts);
  }
}

export class ColorField<D extends Data> extends BaseStringField<D> {
  protected readonly editor = ColorEditor;
}

export class ColorFieldDefinition<D extends Data> extends BaseStringFieldDefinition<D> {
  protected buildStringImpl(
    opts: OptionsInput<FieldDefinitionBuildOptions<D> & Optionals<string>> & OptionsInput<Shared>,
  ) {
    return new ColorField<D>(opts);
  }
}
