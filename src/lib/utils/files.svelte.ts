import { defer } from '$lib/utils/promise.js';
import { getter, options } from './options.svelte.ts';

const createModel = (file: File) => {
  const name = file.name;
  const contentType = file.type;
  const size = file.size;

  const url = $derived(URL.createObjectURL(file));
  const isImage = $derived(contentType.startsWith('image/'));

  return options(
    {
      file,
      name,
      contentType,
      size,
      url: getter(() => url),
      isImage: getter(() => isImage),
    },
    {
      name: 'FileModel',
      serialized: ['name', 'contentType'],
    },
  );
};

export type FileModel = ReturnType<typeof createModel>;

export type PickFilesOptions = {
  multiple?: boolean;
  accept?: string[];
};

export type Picked = {
  status: 'picked';
  models: FileModel[];
};

export type Cancelled = {
  status: 'cancelled';
};

export const pickFiles = (opts: PickFilesOptions): Promise<Picked | Cancelled> => {
  const deferred = defer<Picked | Cancelled>();

  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = opts.multiple ?? false;
  if (opts.accept) {
    input.accept = opts.accept.join(', ');
  }

  const change = () => {
    const files = [...(input.files ?? [])];
    const models = files.map((file) => createModel(file));
    deferred.resolve({ status: 'picked', models });
    input.value = '';
  };

  const cancel = () => {
    deferred.resolve({ status: 'cancelled' });
  };

  input.addEventListener('change', change, { once: true });
  input.addEventListener('cancel', cancel, { once: true });
  input.click();

  return deferred.promise;
};

export const pickFile = async (opts: Omit<PickFilesOptions, 'multiple'>) => {
  const result = await pickFiles(opts);
  if (result.status === 'picked') {
    const [model] = result.models;
    return model;
  }
};
