import { resolve } from '$app/paths';
import { hashCodeTag } from '#lib/tiny/properties/property.svelte.js';
import type { FileData, VariantData } from './server/files/files.ts';
import { getter, options, type OptionsInput } from './utils/options.svelte.ts';
import { defer } from './utils/promise.ts';

export const createRemoteVariant = <V extends VariantData>(_opts: OptionsInput<V & { fileId: string }>) => {
  const opts = options(_opts);

  const identifier = $derived(opts.identifier);
  const contentType = $derived(opts.contentType);
  const size = $derived(opts.size);

  const dimensions = $derived.by(() => {
    const { width, height } = opts;
    if (width && height) {
      return { width, height };
    }
  });

  const url = $derived(resolve('/files/[id]/[variant=variants]', { id: opts.fileId, variant: identifier }));

  return options({
    identifier: getter(() => identifier),
    contentType: getter(() => contentType),
    size: getter(() => size),
    dimensions: getter(() => dimensions),
    url: getter(() => url),
  });
};

const createIsImage = (contentType: string) => contentType.startsWith('image/');

export const createRemoteFile = <D extends FileData = FileData>(_opts: OptionsInput<D>) => {
  const data = options(_opts);

  const id = $derived(data.id);
  const name = $derived(data.name);

  const variants = $derived(data.variants.map((variant) => createRemoteVariant({ ...variant, fileId: id })));

  const variant = (identifier: Tiny.FileVariants) => {
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

export const asRemoteFile = <D extends FileData = FileData>(opts: OptionsInput<D> | undefined) => {
  if (opts) {
    return createRemoteFile<D>(opts);
  }
};

export const createLocalFile = (file: File) => {
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

export type RemoteFile = ReturnType<typeof createRemoteFile>;
export type LocalFile = ReturnType<typeof createLocalFile>;
export type UniversalFile = LocalFile | RemoteFile;
