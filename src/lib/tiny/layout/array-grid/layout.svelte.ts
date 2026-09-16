import type { ArrayField, ArrayFieldItem } from '#lib/tiny/fields/fields/array.svelte.js';
import type { InferArrayFieldItem } from '#lib/tiny/fields/models/types.svelte.js';
import { useFiles, type LocalFile } from '#lib/tiny/files.svelte.js';
import type { AspectRatio } from '#lib/tiny/utils/aspect-ratio.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { useEditingLayout, type EditingLayoutOptions, type Model } from '../editing/layout.svelte.ts';

export type GridModel = Model & {
  accept: string[];
  onFiles?: (files: LocalFile[]) => void;
};

export type ArrayGridEditingLayoutOptions<M extends GridModel, F extends ArrayField> = {
  field: F | undefined;
  aspectRatio: AspectRatio;
} & EditingLayoutOptions<M>;

export const useArrayGridEditingLayout = <
  M extends GridModel = GridModel,
  F extends ArrayField = ArrayField,
  I extends ArrayFieldItem = ArrayFieldItem,
>(
  _opts: OptionsInput<ArrayGridEditingLayoutOptions<M, F>>,
) => {
  const opts = options(_opts);
  const files = useFiles();

  const field = $derived(opts.field);
  const aspectRatio = $derived(opts.aspectRatio);
  const accept = $derived(opts.model.accept);
  const onFiles = $derived(opts.model.onFiles);

  let _selected = $state<I>();

  const selected = $derived.by(() => {
    if (_selected && field?.items.includes(_selected)) {
      return _selected;
    }
  });

  const onSelect = (next: I | undefined) => {
    _selected = next;
  };

  const onAdd = $derived.by(() => {
    if (accept && onFiles) {
      return async () => {
        const picked = await files.pick.files({ accept });
        if (picked.status === 'picked') {
          onFiles(picked.models);
        }
      };
    }
  });

  const editing = useEditingLayout({
    model: getter(() => opts.model),
  });

  return options({
    accept: getter(() => accept),
    field: getter(() => field),
    aspectRatio: getter(() => aspectRatio),
    editing,
    selected: getter(() => selected),
    onSelect,
    onFiles: getter(() => onFiles),
    onAdd,
  });
};

export type ArrayGridEditingLayout<M extends GridModel = GridModel, F extends ArrayField = ArrayField> = ReturnType<
  typeof useArrayGridEditingLayout<M, F>
>;

export type InferFieldFromLayout<L> = L extends ArrayGridEditingLayout<GridModel, infer F> ? F : never;
export type InferItemFromLayout<L> = InferArrayFieldItem<InferFieldFromLayout<L>>;
