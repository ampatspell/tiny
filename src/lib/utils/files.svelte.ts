import { resolve } from '$app/paths';
import { hashCodeTag } from '$lib/properties/property.svelte.js';
import { defer } from '$lib/utils/promise.js';
import { getter, options, type OptionsInput } from './options.svelte.ts';

const createIsImage = (contentType: string) => contentType.startsWith('image/');

export type FileData = {
  id: string;
  name: string;
  contentType: string;
  size: number;
};

export const createRemoteFile = <D extends FileData = FileData>(_opts: OptionsInput<D>) => {
  const data = options(_opts);

  const id = $derived(data.id);
  const name = $derived(data.name);
  const contentType = $derived(data.contentType);
  const size = $derived(data.size);

  const url = $derived(resolve('/files/[id]', { id }));
  const isImage = $derived(createIsImage(contentType));

  const hashCode = $derived(`remote-file-${id}`);

  return options(
    {
      type: 'remote' as const,
      data,
      file: undefined,
      id: getter(() => id),
      name: getter(() => name),
      contentType: getter(() => contentType),
      size: getter(() => size),
      url: getter(() => url),
      isImage: getter(() => isImage),
      [hashCodeTag]: getter(() => hashCode),
    },
    {
      name: 'RemoteFileModel',
      serialized: ['id', 'name', 'contentType'],
    },
  );
};

export type RemoteFile = ReturnType<typeof createRemoteFile>;

export const asFile = <D extends FileData = FileData>(opts: OptionsInput<D> | undefined) => {
  if (opts) {
    return createRemoteFile<D>(opts) as UniversalFile;
  }
};

const createLocalFile = (file: File) => {
  const name = file.name;
  const contentType = file.type;
  const size = file.size;

  const url = $derived(URL.createObjectURL(file));
  const isImage = $derived(createIsImage(contentType));

  return options(
    {
      type: 'local' as const,
      file,
      data: undefined,
      name,
      contentType,
      size,
      url: getter(() => url),
      isImage: getter(() => isImage),
    },
    {
      name: 'LocalFileModel',
      serialized: ['name', 'contentType'],
    },
  );
};

export type LocalFile = ReturnType<typeof createLocalFile>;

export type UniversalFile = LocalFile | RemoteFile;

export type PickFilesOptions = {
  multiple?: boolean;
  accept?: string[];
};

export type Picked = {
  status: 'picked';
  models: LocalFile[];
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
    const models = files.map((file) => createLocalFile(file));
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
