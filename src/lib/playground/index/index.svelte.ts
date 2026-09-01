import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { useDataFields } from '#lib/tiny/fields/data.svelte.js';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import { asFile } from '#lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { images, run } from '#lib/tiny/utils/utils.js';
import { updateIndex, updateIndexFile, type IndexData } from './index.remote.ts';

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

  const title = fields.field.string('title', { validator: notBlank() });
  const description = fields.field.string('description');
  const background = fields.field.file('background', { accept: images });
  const backgroundOffset = fields.field.number('backgroundOffset', {
    meta: { description: 'Negative values crop the image' },
  });
  const indexBackgroundColor = fields.field.color('indexBackgroundColor');
  const indexTextColor = fields.field.color('indexTextColor');
  const backgroundColor = fields.field.color('backgroundColor');
  const textColor = fields.field.color('textColor');

  const isDirty = $derived(fields.isDirty);
  const rollback = () => fields.rollback();

  const save = async () => {
    if (fields.touch()) {
      const { omit: data, pick: files } = fields.with('background').dirty;
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

  return options(
    {
      fields,
      title,
      description,
      background,
      backgroundOffset,
      indexBackgroundColor,
      indexTextColor,
      backgroundColor,
      textColor,
      isDirty: getter(() => isDirty),
      save,
      rollback,
    },
    {
      name: 'IndexProperties',
    },
  );
};

export type IndexModel = ReturnType<typeof useIndexModel>;
