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
