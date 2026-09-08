import { FieldsDefinition } from './models/fields-definition.svelte.ts';
import type { Data } from './models/types.svelte.ts';

export const withDataFields = <D extends Data = Data>(...opts: ConstructorParameters<typeof FieldsDefinition<D>>) => {
  return new FieldsDefinition(...opts);
};
