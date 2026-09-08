import type { Unpack } from '../utils/utils.ts';
import type { Factory } from './factory.svelte.ts';
import type { FieldDefinition } from './field-definition.svelte.ts';
import type { Field } from './field.svelte.ts';

export type Data = Record<string, unknown>;

export type InferFieldsDefinitionRecordFromFactory<F> = F extends Factory<Data, infer R> ? R : never;

export type InferFieldsFromDefinitionRecord<R extends Data> = {
  [K in keyof R]: InferFieldFromDefinition<R[K]>;
};

export type InferFieldFromDefinition<T> = T extends FieldDefinition ? ReturnType<T['field']> : T;

export type InferSerializedFromFieldsRecord<R extends Data> = Unpack<{
  [K in keyof R]: InferSerializedFromField<R[K]>;
}>;

export type InferSerializedFromField<T> = T extends Field ? T['serialized'] : T;
