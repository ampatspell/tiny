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
