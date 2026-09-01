import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { useDataFields } from '#lib/tiny/fields/data.svelte.js';
import type { Field } from '#lib/tiny/fields/utils.svelte.js';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import { asFile } from '#lib/tiny/utils/files.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { images, type Any } from '#lib/tiny/utils/utils.js';
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

  const serialize = <
    I extends Record<string, Field>,
    O extends Partial<{
      [K in keyof I]: I[K]['serialized'];
    }>,
  >(
    input: I,
  ): O | undefined => {
    let output = {} as O;
    Object.keys(input).forEach((key) => {
      let field = input[key];
      if (field.property.isDirty) {
        output[key as keyof I] = field.serialized as Any;
      }
    });
    if (Object.keys(output).length) {
      return output;
    }
  };

  $effect(() => {
    console.log(serialize(all));
  });

  const save = async () => {
    if (fields.touch()) {
      let dirty = serialize(all);
      if (dirty) {
        await updateIndex(dirty);
      }
      // const { omit: data, pick: files } = fields.with('background').dirty;
      // await Promise.all([
      //   run(async () => {
      //     if (data) {
      //       await updateIndex(data);
      //     }
      //   }),
      //   run(async () => {
      //     if (files) {
      //       await updateIndexFile({ file: files.background?.file });
      //     }
      //   }),
      // ]);
      broadcast.notifyDidSave();
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
      name: 'IndexProperties',
    },
  );
};

export type IndexModel = ReturnType<typeof useIndexModel>;
