import type { RemoteResource } from '$app/server';

export const images = ['image/png', 'image/jpeg'];

export const run = <T>(cb: () => T): T => {
  return cb();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type QueryResponse<T extends (...args: Any[]) => Any> =
  ReturnType<T> extends RemoteResource<infer R> ? R : undefined;

export type OmitId<T> = Omit<T, 'id'>;

export type MaybeGetter<T> = (() => T) | T;

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export function extract<T>(value: MaybeGetter<T>): T;
export function extract<T>(value: MaybeGetter<T | undefined>, defaultValue: T): T;

export function extract(value: unknown, defaultValue?: unknown) {
  if (isFunction(value)) {
    const getter = value;
    const gotten = getter();
    if (gotten === undefined) return defaultValue;
    return gotten;
  }

  if (value === undefined) return defaultValue;
  return value;
}
