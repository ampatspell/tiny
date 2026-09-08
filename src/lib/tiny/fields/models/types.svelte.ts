import type { Factory } from './factory.svelte.ts';
import type { FieldDefinition } from './field-definition.svelte.ts';
import type { Field } from './field.svelte.ts';

export type Data = Record<string, unknown>;

export type InferFieldsDefinitionRecordFromFactory<F> = F extends Factory<Data, infer R> ? R : never;

export type InferFieldsFromDefinitionRecord<R extends Data> = {
  [K in keyof R]: InferFieldFromDefinition<R[K]>;
};

export type InferFieldFromDefinition<T> = T extends FieldDefinition ? ReturnType<T['field']> : T;

export type InferSerializedAllFromFieldsRecord<R extends Data> = {
  [K in keyof R]: InferSerializedAllFromField<R[K]>;
};

export type InferSerializedDirtyFromFieldsRecord<R extends Data> = {
  [K in keyof R]: InferSerializedDirtyFromField<R[K]>;
};

export type InferSerializedAllFromField<T> = T extends Field ? T['serialized']['all'] : T;
export type InferSerializedDirtyFromField<T> = T extends Field ? T['serialized']['dirty'] : T;

export type InferSerializedAllFromDefinitionRecord<R extends Data> = InferSerializedAllFromFieldsRecord<
  InferFieldsFromDefinitionRecord<R>
>;

export type InferSerializedDirtyFromDefinitionRecord<R extends Data> = InferSerializedDirtyFromFieldsRecord<
  InferFieldsFromDefinitionRecord<R>
>;

export type SerializedDirtyArrayItemRecord<D> =
  | {
      state: 'deleted';
      id: string;
    }
  | ({
      state: 'updated';
      id: string;
    } & Partial<D>)
  | ({
      state: 'added';
    } & D);

export type SerializedDirtyArrayItem<R extends Data> = SerializedDirtyArrayItemRecord<
  InferSerializedDirtyFromDefinitionRecord<R>
>;
