import { extract, type MaybeGetter } from 'runed';
import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import type { OmitId } from '$lib/utils/utils.js';
import { slug } from '$lib/utils/string.js';
import { getter, options } from '$lib/utils/options.js';

export type UseGalleryPropertiesOptions = { data: MaybeGetter<OmitId<GalleryData>> };

const useGalleryProperties = (_opts: UseGalleryPropertiesOptions) => {
  const opts = options(_opts);
  const properties = useDataProperties(opts.data);
  const name = properties.property('name', {
    didUpdate: ({ after }) => permalink.update(slug(after, { replacement: '-' })),
    validator: notBlank(),
  });
  const permalink = properties.property('permalink');
  return {
    properties,
    name,
    permalink,
  };
};

export type UseNewGalleryPropertiesOptions = { onSaved: (id: string) => void };

export const useNewGalleryProperties = (opts: UseNewGalleryPropertiesOptions) => {
  const base = useGalleryProperties({ data: { name: '', permalink: '' } });
  const properties = $derived(base.properties);

  const name = $derived(base.name);
  const permalink = $derived(base.permalink);

  const save = async () => {
    const { onSaved } = opts;
    if (properties.touch()) {
      const data = properties.data;
      const id = await addGallery(data);
      onSaved(id);
    }
  };
  return options({
    name: getter(() => name),
    permalink: getter(() => permalink),
    save,
  });
};

export type UseEditGalleryPropertiesOptions = {
  data: MaybeGetter<GalleryData>;
  onSaved?: () => void;
};

export const useEditGalleryProperties = (opts: UseEditGalleryPropertiesOptions) => {
  const base = useGalleryProperties({ data: opts.data });
  const properties = $derived(base.properties);
  const data = $derived(extract(opts.data));
  const id = $derived(data.id);

  const name = $derived(base.name);
  const permalink = $derived(base.permalink);
  const isDirty = $derived(base.properties.isDirty);

  const save = async () => {
    const { onSaved } = opts;
    if (properties.touch()) {
      const data = properties.dirty;
      if (data) {
        await updateGallery({ id, ...data });
        onSaved?.();
      }
    }
  };

  return options({
    name: getter(() => name),
    permalink: getter(() => permalink),
    isDirty: getter(() => isDirty),
    save,
  });
};

export type UseEditGalleryProperties = ReturnType<typeof useEditGalleryProperties>;
