import { extract, type MaybeGetter } from 'runed';
import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import type { OmitId } from '$lib/utils/utils.js';
import { slug } from '$lib/utils/string.js';

export type UseGalleryPropertiesOptions = { data: MaybeGetter<OmitId<GalleryData>> };

export class UseGalleryProperties {
  constructor(private opts: UseGalleryPropertiesOptions) {}

  private data = $derived.by(() => extract(this.opts.data));

  properties = useDataProperties(this.data);

  name = this.properties.property('name', {
    didUpdate: ({ after }) => this.permalink.update(slug(after, { replacement: '-' })),
    validator: notBlank(),
  });

  permalink = this.properties.property('permalink');
}

const useGalleryProperties = (opts: UseGalleryPropertiesOptions) => {
  return new UseGalleryProperties(opts);
};

export type UseNewGalleryPropertiesOptions = { onSaved: (id: string) => void };

export class UseNewGalleryProperties {
  private base: UseGalleryProperties;

  constructor(private opts: UseNewGalleryPropertiesOptions) {
    this.base = useGalleryProperties({ data: { name: '', permalink: '' } });
  }

  private properties = $derived.by(() => this.base.properties);

  name = $derived.by(() => this.base.name);
  permalink = $derived.by(() => this.base.permalink);

  save = async () => {
    const {
      properties,
      opts: { onSaved },
    } = this;
    if (properties.touch()) {
      const data = properties.data;
      const id = await addGallery(data);
      onSaved(id);
    }
  };
}

export const useNewGalleryProperties = (opts: UseNewGalleryPropertiesOptions) => {
  return new UseNewGalleryProperties(opts);
};

export type UseEditGalleryPropertiesOptions = {
  data: MaybeGetter<GalleryData>;
  onSaved?: () => void;
};

export class UseEditGalleryProperties {
  private base: UseGalleryProperties;

  constructor(private opts: UseEditGalleryPropertiesOptions) {
    this.base = useGalleryProperties({ data: opts.data });
  }

  private properties = $derived.by(() => this.base.properties);
  data = $derived.by(() => extract(this.opts.data));
  id = $derived(this.data.id);

  name = $derived.by(() => this.base.name);
  permalink = $derived.by(() => this.base.permalink);
  isDirty = $derived.by(() => this.base.properties.isDirty);

  save = async () => {
    const {
      properties,
      opts: { onSaved },
    } = this;
    if (properties.touch()) {
      const data = properties.dirty;
      if (data) {
        const { id } = this;
        await updateGallery({ id, ...data });
        onSaved?.();
      }
    }
  };
}

export const useEditGalleryProperties = (opts: UseEditGalleryPropertiesOptions) => {
  return new UseEditGalleryProperties(opts);
};
