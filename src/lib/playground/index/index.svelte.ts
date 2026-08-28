import { useBroadcastChannel } from '$lib/tiny/broadcast.svelte.js';
import { useDataFields } from '$lib/tiny/properties/editors/data.svelte.js';
import { notBlank } from '$lib/tiny/properties/validator.svelte.js';
import { asFile } from '$lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '$lib/tiny/utils/options.svelte.js';
import { images, run } from '$lib/tiny/utils/utils.js';
import { updateIndex, updateIndexFile, type IndexData } from './index.remote.ts';

export type UseIndexPropertiesOptions = {
  data: IndexData;
};

export const useIndexProperties = (_opts: OptionsInput<UseIndexPropertiesOptions>) => {
  const opts = options(_opts);

  const data = $derived(opts.data);
  const id = $derived(data.id);

  const broadcast = useBroadcastChannel();

  const fields = run(() => {
    const all = useDataFields({
      data: getter(() => ({
        ...data,
        background: asFile(data.background),
      })),
    });
    return {
      all,
      title: all.field.string('title', { validator: notBlank() }),
      description: all.field.string('description'),
      background: all.field.file('background', { accept: images }),
      backgroundOffset: all.field.number('backgroundOffset'),
      indexBackgroundColor: all.field.color('indexBackgroundColor'),
      indexTextColor: all.field.color('indexTextColor'),
      backgroundColor: all.field.color('backgroundColor'),
      textColor: all.field.color('textColor'),
    };
  });

  const isDirty = $derived(fields.all.isDirty);

  const save = async () => {
    if (fields.all.touch()) {
      const { omit: data, pick: files } = fields.all.with('background').dirty;
      await Promise.all([
        run(async () => {
          if (data) {
            await updateIndex(data);
          }
        }),
        run(async () => {
          if (files) {
            await updateIndexFile({ file: files.background?.file });
          }
        }),
      ]);
      broadcast.notifyDidSave();
      return id;
    }
  };

  const rollback = () => fields.all.rollback();

  return options(
    {
      fields,
      isDirty: getter(() => isDirty),
      save,
      rollback,
    },
    {
      name: 'IndexProperties',
    },
  );
};

export type IndexProperties = ReturnType<typeof useIndexProperties>;
