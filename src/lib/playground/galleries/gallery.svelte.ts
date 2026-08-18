import { extract, type MaybeGetter } from 'runed';
import { addGallery, updateGallery, type GalleryData } from './galleries.remote.ts';
import { useDataProperties } from '$lib/properties/data.svelte.js';
import { notBlank } from '$lib/properties/validator.svelte.js';
import type { OmitId } from '$lib/utils/utils.js';
import { slug } from '$lib/utils/string.js';

const useGalleryProperties = ({ data }: { data: MaybeGetter<OmitId<GalleryData>> }) => {
  class UseGalleryProperties {
    properties = useDataProperties(data);
    name = this.properties.property('name', {
      didUpdate: ({ after }) => this.permalink.update(slug(after, { replacement: '-' })),
      validator: notBlank(),
    });
    permalink = this.properties.property('permalink');
  }
  return new UseGalleryProperties();
};

export const useNewGalleryProperties = ({ onSaved }: { onSaved: (id: string) => void }) => {
  const base = useGalleryProperties({ data: { name: '', permalink: '' } });
  const { properties } = base;

  class UseNewGalleryProperties {
    name = $derived(base.name);
    permalink = $derived(base.permalink);

    save = async () => {
      if (properties.touch()) {
        const data = properties.data;
        const id = await addGallery(data);
        onSaved(id);
      }
    };
  }
  return new UseNewGalleryProperties();
};

export const useEditGalleryProperties = ({
  data,
  onSaved,
}: {
  data: MaybeGetter<GalleryData>;
  onSaved?: () => void;
}) => {
  const base = useGalleryProperties({ data });
  const { properties } = base;

  class UseEditGalleryProperties {
    id = $derived(extract(data).id);

    name = $derived(base.name);
    permalink = $derived(base.permalink);

    isDirty = $derived(base.properties.isDirty);

    save = async () => {
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
  return new UseEditGalleryProperties();
};

export type UseEditGalleryProperties = ReturnType<typeof useEditGalleryProperties>;
