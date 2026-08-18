import type { MaybeGetter } from 'runed';
import type { GalleryData } from './galleries.remote.ts';
import { useDataProperties, type DataProperties } from '$lib/properties/data.svelte.js';
import type { Property } from '$lib/properties/property.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import slug from 'slug';

export type Data = Omit<GalleryData, 'id'>;

export type UsedGalleryPropertiesOptions = {
  data: MaybeGetter<Data>;
};

export class UsedGalleryProperties {
  private readonly _opts: UsedGalleryPropertiesOptions;
  private readonly _properties: DataProperties<Data>;

  readonly name: Property<string>;
  readonly permalink: Property<string>;

  constructor(opts: UsedGalleryPropertiesOptions) {
    this._opts = opts;
    this._properties = useDataProperties(this._opts.data);
    this.name = this._properties.property('name', {
      didUpdate: ({ after }) => this.permalink.update(slug(after, { replacement: '-' })),
      validator: notBlank(),
    });
    this.permalink = this._properties.property('permalink');
  }

  readonly touch = () => this._properties.touch();
  readonly data = $derived.by(() => this._properties.data);
  readonly dirty = $derived.by(() => this._properties.dirty);
}

export const useGalleryProperties = (opts: UsedGalleryPropertiesOptions) => {
  return new UsedGalleryProperties(opts);
};
