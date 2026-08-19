import { defer } from '$lib/utils/promise.js';

export type PickFilesOptions = {
  multiple?: boolean;
  accept?: string[];
};

export type Picked = {
  status: 'picked';
  files: File[];
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
    deferred.resolve({ status: 'picked', files });
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
    const [file] = result.files;
    return file;
  }
};
