import type { RemoteResource } from '$app/server';
import type { UniversalFile } from './files.svelte.ts';

export const images = ['image/png', 'image/jpeg'];

export const run = <T>(cb: () => T): T => {
  return cb();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type StringKey<T> = {
  [K in keyof T]: T[K] extends string ? K & string : never;
}[keyof T];

export type NumberKey<T> = {
  [K in keyof T]: T[K] extends number ? K & string : never;
}[keyof T];

export type FileKey<T> = {
  [K in keyof T]: T[K] extends UniversalFile | undefined ? K & string : never;
}[keyof T];

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
