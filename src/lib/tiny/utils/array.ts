import type { Any } from './utils.ts';

export type SortDirection = 'asc' | 'desc';

export type SortDescriptor<T> = {
  value: (object: T) => Any;
  direction: SortDirection;
};

export type SortDescriptors<T> = SortDescriptor<T> | SortDescriptor<T>[];

const toDescriptors = <T>(arg: SortDescriptors<T>) => {
  if (Array.isArray(arg)) {
    return arg;
  }
  return [arg];
};

export function sortedBy<T>(arr: T[], _descriptors: SortDescriptors<T> | undefined): T[] {
  if (!_descriptors) {
    return arr;
  }

  const descriptors = toDescriptors(_descriptors);

  const sort = (descriptor: SortDescriptor<T>, a: T, b: T) => {
    const av = descriptor.value(a);
    const bv = descriptor.value(b);
    if (av === bv) {
      return 0;
    }
    if (descriptor.direction === 'desc') {
      return av < bv ? 1 : -1;
    } else {
      return av < bv ? -1 : 1;
    }
  };

  return [...arr].sort((a, b) => {
    for (const descriptor of descriptors) {
      const order = sort(descriptor, a, b);
      if (order !== 0) {
        return order;
      }
    }
    return 0;
  });
}

export function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value;
}

export function firstObject<T>(arr: readonly T[]): T | undefined {
  return arr && arr[0];
}

export function lastObject<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1];
}

export function nextObject<T>(array: readonly T[], item: T, wrap: boolean = false) {
  const idx = array.indexOf(item);
  if (idx === -1) {
    return;
  } else if (wrap && idx === array.length - 1) {
    return array[0];
  }
  return array[idx + 1];
}

export const prevObject = <T>(array: readonly T[], object: T, wrap: boolean = false) => {
  const idx = array.indexOf(object);
  if (idx === -1) {
    return;
  }
  if (idx === 0) {
    if (wrap) {
      return lastObject(array);
    }
    return;
  }
  return array[idx - 1];
};

export const removeObjectAt = <T>(array: T[], index: number) => {
  if (index > -1) {
    array.splice(index, 1);
  }
};

export const addObject = <T>(array: T[], entry: T) => {
  if (array.includes(entry)) {
    return;
  }
  array.push(entry);
};

export const removeObject = <T>(array: T[], entry: T) => {
  const index = array.indexOf(entry);
  removeObjectAt(array, index);
};
