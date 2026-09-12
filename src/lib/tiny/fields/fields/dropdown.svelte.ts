import type { ItemData } from '#lib/tiny/dropdown/basic/items.svelte';
import type { StringKey } from '#lib/tiny/utils/utils.js';
import type { CreateFieldOptions } from '../models/field-definition.svelte.ts';
import Dropdown from './-dropdown.svelte';
import { ValueField, ValueFieldDefinition, type ValueFieldDefinitionOptions } from './value.svelte.ts';

type T = string;

export class DropdownField<I extends ItemData> extends ValueField<T, T, DropdownFieldDefinition<I>> {
  readonly items = $derived(this.definition.items);
  private readonly identifier = $derived(this.definition.identifier);
  readonly selected = $derived.by(() => {
    const value = this.value;
    const identifier = this.identifier;
    return this.items.find((item) => item[identifier] === value);
  });
  readonly onSelect = (model: I | undefined) => {
    if (model) {
      const value = model[this.identifier] as string;
      this.update(value);
    }
  };
  readonly isRequired = $derived(this.validator?.isRequired ?? false);
  protected readonly _serialized = $derived(this.value);
  protected editor = Dropdown<ItemData>;
}

export type DropdownFieldDefinitionOptions<I extends ItemData> = ValueFieldDefinitionOptions<T, DropdownField<I>> & {
  items: I[];
  identifier: StringKey<I>;
};

export class DropdownFieldDefinition<I extends ItemData> extends ValueFieldDefinition<
  T,
  DropdownField<I>,
  DropdownFieldDefinitionOptions<I>
> {
  readonly items = $derived(this.opts.items);
  readonly identifier = $derived(this.opts.identifier);

  field(opts: CreateFieldOptions): DropdownField<I> {
    return new DropdownField<I>({
      definition: this,
      ...opts,
    });
  }
}
