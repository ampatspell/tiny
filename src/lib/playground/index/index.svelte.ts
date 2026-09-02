import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withData } from '#lib/tiny/fields/data.svelte.js';
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

  const { fields, state } = withData({
    data: getter(() => ({
      ...data,
      background: asFile(data.background),
    })),
  }).define(({ string, number, file, color }) => ({
    title: string('title'),
    description: string('description'),
    background: file('background', { accept: images }),
    backgroundOffset: number('backgroundOffset', {
      meta: { description: 'Negative values crop the image' },
    }),
    indexBackgroundColor: color('indexBackgroundColor'),
    indexTextColor: color('indexTextColor'),
    backgroundColor: color('backgroundColor'),
    textColor: color('textColor'),
  }));

  const save = async () => {
    if (state.touch()) {
      const dirty = state.serialized.dirty;
      if (dirty) {
        await updateIndex(dirty);
        broadcast.notifyDidSave();
      }
      return id;
    }
  };

  return options(
    {
      ...fields,
      ...state.actions,
      save,
    },
    {
      name: 'IndexModel',
    },
  );
};

export type IndexModel = ReturnType<typeof useIndexModel>;
