import type { Any, ArrayKey, FileKey, NumberKey, StringKey } from '#lib/tiny/utils/utils.js';
import { ArrayFieldDefinition } from './array.svelte.ts';
import type { FieldDefinitionsRecord } from './definitions.svelte.ts';
import { FileFieldDefinition } from './file.svelte.ts';
import type { Data } from './index.svelte.ts';
import { NumberFieldDefinition } from './number.svelte.ts';
import { StringFieldDefinition } from './string.svelte.ts';

type ArrayNestedData<D, K extends ArrayKey<D, Data>> = D[K] extends Any[] ? D[K][number] : never;

export class Factory<D extends Data> {
  string<K extends StringKey<D>>(key: K) {
    return new StringFieldDefinition<D>({ key });
  }

  number<K extends NumberKey<D>>(key: K) {
    return new NumberFieldDefinition<D>({ key });
  }

  file<K extends FileKey<D>>(key: K) {
    return new FileFieldDefinition<D>({ key });
  }

  array<K extends ArrayKey<D, Data>, FDR extends FieldDefinitionsRecord<N>, N extends ArrayNestedData<D, K>>(
    key: K,
    cb: (factory: Factory<N>) => FDR,
  ) {
    return new ArrayFieldDefinition<D, N, FDR>({ key, cb });
  }
}
