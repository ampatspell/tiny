import { hashCodeTag } from '#lib/tiny/properties/property.svelte.js';
import type { FileData, VariantData } from './server/files/files.ts';
import { getter, options, type OptionsInput } from './utils/options.svelte.ts';
import { defer } from './utils/promise.ts';
import { createContext } from 'svelte';
import { useTiny } from './entrypoint/tiny.svelte.ts';

const createRemoteVariant = (
  _opts: OptionsInput<{
    data: VariantData;
    id: string;
    files: FilesContext;
  }>,
) => {
  const opts = options(_opts);
  const data = $derived(opts.data);

  const identifier = $derived(data.identifier);
  const contentType = $derived(data.contentType);
  const size = $derived(data.size);

  const dimensions = $derived.by(() => {
    const { width, height } = data;
    if (width && height) {
      return { width, height };
    }
  });

  const url = $derived(opts.files.resolve({ id: opts.id, variant: identifier }));

  return options({
    identifier: getter(() => identifier),
    contentType: getter(() => contentType),
    size: getter(() => size),
    dimensions: getter(() => dimensions),
    url: getter(() => url),
  });
};

const createIsImage = (contentType: string) => contentType.startsWith('image/');

const createRemoteFile = (opts: { data: FileData; files: FilesContext }) => {
  const { data, files } = opts;
  const id = $derived(data.id);
  const name = $derived(data.name);

  const variants = $derived(
    data.variants.map((data) =>
      createRemoteVariant({
        data,
        id,
        files,
      }),
    ),
  );

  const variant = (identifier: Tiny.FileVariant) => {
    const variant = variants.find((variant) => variant.identifier === identifier);
    if (variant) {
      return variant;
    }
    throw new Error(`Variant '${variant}' not found`);
  };

  const original = $derived(variant('original'));
  const contentType = $derived(original.contentType);
  const size = $derived(original.size);
  const isImage = $derived(createIsImage(contentType));

  const url = $derived.by(() => {
    const identifier = isImage ? '1024x1024' : 'original';
    return variant(identifier).url;
  });

  const hashCode = $derived(`remote-file-${id}`);

  return options(
    {
      type: 'remote' as const,
      data,
      file: undefined,
      variant,
      id: getter(() => id),
      name: getter(() => name),
      contentType: getter(() => contentType),
      size: getter(() => size),
      isImage: getter(() => isImage),
      url: getter(() => url),
      [hashCodeTag]: getter(() => hashCode),
    },
    {
      name: 'RemoteFile',
      serialized: ['id', 'name', 'contentType'],
    },
  );
};

const asRemoteFile = ({ data, files }: { data: FileData | undefined; files: FilesContext }) => {
  if (data) {
    return createRemoteFile({ data, files });
  }
};

export type CreateLocalFileOptions = { file: File };

const createLocalFile = ({ data }: { data: CreateLocalFileOptions; files: FilesContext }) => {
  const file = data.file;
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
      name: 'LocalFile',
      serialized: ['name', 'contentType'],
    },
  );
};

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

const pickFiles = (opts: PickFilesOptions & { files: FilesContext }): Promise<Picked | Cancelled> => {
  const deferred = defer<Picked | Cancelled>();
  const files = opts.files;

  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = opts.multiple ?? false;
  if (opts.accept) {
    input.accept = opts.accept.join(', ');
  }

  const change = () => {
    const arr = [...(input.files ?? [])];
    const models = arr.map((file) => createLocalFile({ data: { file }, files }));
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

export type PickFileOptions = Omit<PickFilesOptions, 'multiple'>;

const pickFile = async (opts: PickFileOptions & { files: FilesContext }) => {
  const result = await pickFiles(opts);
  if (result.status === 'picked') {
    const [model] = result.models;
    return model;
  }
};

export type RemoteFile = ReturnType<typeof createRemoteFile>;
export type LocalFile = ReturnType<typeof createLocalFile>;
export type UniversalFile = LocalFile | RemoteFile;

const createFiles = () => {
  const tiny = useTiny();

  const files = options(
    {
      asRemote: (data: FileData | undefined) => asRemoteFile({ data, files }),
      create: {
        local: (data: CreateLocalFileOptions) => createLocalFile({ data, files }),
        remote: (data: FileData) => createRemoteFile({ data, files }),
      },
      pick: {
        file: (opts: PickFileOptions) => pickFile({ ...opts, files }),
        files: (opts: PickFilesOptions) => pickFiles({ ...opts, files }),
      },
      resolve: (...args: Parameters<(typeof tiny)['files']['resolve']>) => tiny.files.resolve(...args),
    },
    { name: 'Files' },
  );
  return files;
};

export type FilesContext = ReturnType<typeof createFiles>;

const [get, set] = createContext<FilesContext>();

export const setFiles = () => set(createFiles());
export const useFiles = () => get();
