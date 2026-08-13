export type Deferred<T> = ReturnType<typeof defer<T>>;

export const defer = <T>() => {
  let resolve: (value: T | Promise<T>) => void;
  let reject: (error: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
};

export const run = <T>(cb: () => T): T => {
  return cb();
};

export const round = (value: number, decimals = 2) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return NaN;
  }
  const valueParts = num.toString().split('e');
  const ae = valueParts[1] ? Number(valueParts[1]) : 0;
  const shifted = Math.round(Number(`${valueParts[0]}e${ae + decimals}`));
  const parts = shifted.toString().split('e');
  const be = parts[1] ? Number(parts[1]) : 0;
  return Number(`${parts[0]}e${be - decimals}`);
};

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
