import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import type { OmitId } from '$lib/utils/utils.js';
import { slug } from '$lib/utils/string.js';
import { getter, options, type OptionsInput } from '$lib/utils/options.svelte.js';

export type UseGalleryPropertiesOptions = { data: OmitId<GalleryData> };

const useGalleryProperties = (_opts: OptionsInput<UseGalleryPropertiesOptions>) => {
  const opts = options(_opts);
  const properties = useDataProperties({ data: getter(() => opts.data) });
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

export type NewGalleryPropertiesOptions = { onSaved: (id: string) => void };

export const useNewGalleryProperties = (_opts: OptionsInput<NewGalleryPropertiesOptions>) => {
  const opts = options(_opts);
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
  return options(
    {
      name: getter(() => name),
      permalink: getter(() => permalink),
      save,
    },
    {
      name: 'NewGalleryProperties',
    },
  );
};

export type UseEditGalleryPropertiesOptions = {
  data: GalleryData;
  onSaved?: () => void;
};

export const useEditGalleryProperties = (_opts: OptionsInput<UseEditGalleryPropertiesOptions>) => {
  const opts = options(_opts);
  const data = $derived(opts.data);
  const base = useGalleryProperties({ data: getter(() => data) });
  const properties = $derived(base.properties);
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

  return options(
    {
      name: getter(() => name),
      permalink: getter(() => permalink),
      isDirty: getter(() => isDirty),
      save,
    },
    {
      name: 'EditGalleryProperties',
    },
  );
};

export type EditGalleryProperties = ReturnType<typeof useEditGalleryProperties>;
