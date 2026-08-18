import { extract, type MaybeGetter } from 'runed';
import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import slug from 'slug';

const useGalleryProperties = ({ data }: { data: MaybeGetter<Omit<GalleryData, 'id'>> }) => {
  const properties = useDataProperties(data);

  const name = properties.property('name', {
    didUpdate: ({ after }) => permalink.update(slug(after, { replacement: '-' })),
    validator: notBlank(),
  });

  const permalink = properties.property('permalink');

  return { properties, name, permalink };
};

export const useNewGalleryProperties = ({ onSaved }: { onSaved: (id: string) => void }) => {
  const base = useGalleryProperties({ data: { name: '', permalink: '' } });
  const { properties } = base;

  const save = async () => {
    if (properties.touch()) {
      const data = properties.data;
      const id = await addGallery(data);
      onSaved(id);
    }
  };

  return { ...base, save };
};

export const useEditGalleryProperties = ({
  data,
  onSaved,
}: {
  data: MaybeGetter<GalleryData>;
  onSaved?: () => void;
}) => {
  const id = $derived(extract(data).id);
  const base = useGalleryProperties({ data });
  const { properties } = base;

  const save = async () => {
    if (properties.touch()) {
      const data = properties.dirty;
      if (data) {
        await updateGallery({ id, ...data });
        onSaved?.();
      }
    }
  };

  return { ...base, save };
};
