import { randomBytes } from 'node:crypto';

export const uid = (length = 16) => {
  return randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
    .slice(0, length);
};

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
