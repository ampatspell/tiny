import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { useDataFields } from '#lib/tiny/fields/data.svelte.js';
import { serialize } from '#lib/tiny/fields/utils.svelte.js';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import { asFile } from '#lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { images } from '#lib/tiny/utils/utils.js';
import { updateIndex, type IndexData } from './index.remote.ts';

export type UseIndexModelOptions = {
  data: IndexData;
};

export const useIndexModel = (_opts: OptionsInput<UseIndexModelOptions>) => {
  const opts = options(_opts);

  const data = $derived(opts.data);
  const id = $derived(data.id);

  const broadcast = useBroadcastChannel();

  const fields = useDataFields({
    data: getter(() => ({
      ...data,
      background: asFile(data.background),
    })),
  });

  const all = {
    title: fields.field.string('title', { validator: notBlank() }),
    description: fields.field.string('description'),
    background: fields.field.file('background', { accept: images }),
    backgroundOffset: fields.field.number('backgroundOffset', {
      meta: { description: 'Negative values crop the image' },
    }),
    indexBackgroundColor: fields.field.color('indexBackgroundColor'),
    indexTextColor: fields.field.color('indexTextColor'),
    backgroundColor: fields.field.color('backgroundColor'),
    textColor: fields.field.color('textColor'),
  };

  const isDirty = $derived(fields.isDirty);
  const rollback = () => fields.rollback();

  const save = async () => {
    if (fields.touch()) {
      const dirty = serialize.dirty(all);
      if (dirty) {
        await updateIndex(dirty);
        broadcast.notifyDidSave();
      }
      return id;
    }
  };

  return options(
    {
      fields,
      ...all,
      isDirty: getter(() => isDirty),
      save,
      rollback,
    },
    {
      name: 'IndexModel',
    },
  );
};

export type IndexModel = ReturnType<typeof useIndexModel>;
