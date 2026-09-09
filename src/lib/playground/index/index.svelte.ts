import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { useFiles } from '#lib/tiny/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { images } from '#lib/tiny/utils/utils.js';
import { updateIndex, type IndexData } from './index.remote.ts';

export type UseIndexModelOptions = {
  data: IndexData;
};

export const useIndexModel = (_opts: OptionsInput<UseIndexModelOptions>) => {
  const opts = options(_opts);
  const files = useFiles();

  const data = $derived(opts.data);
  const id = $derived(data.id);

  const broadcast = useBroadcastChannel();

  const model = withDataFields({
    data: getter(() => ({
      ...data,
      background: files.asRemote(data.background),
    })),
  }).define(({ string, number, file, color }) => ({
    title: string('title'),
    description: string('description'),
    background: file('background', { accept: images }),
    backgroundOffset: number('backgroundOffset', {
      description: 'Negative values crop the image',
    }),
    indexBackgroundColor: color('indexBackgroundColor'),
    indexTextColor: color('indexTextColor'),
    backgroundColor: color('backgroundColor'),
    textColor: color('textColor'),
  }));

  const save = async () => {
    if (model.touch()) {
      const dirty = model.serialized.dirty;
      if (dirty) {
        await updateIndex(dirty);
        broadcast.notifyDidSave();
      }
      return id;
    }
  };

  return model.asEditable(
    {
      save,
    },
    { name: 'IndexModel', serialized: ['isDirty'] },
  );
};

export type IndexModel = ReturnType<typeof useIndexModel>;
