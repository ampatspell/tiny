import type { RemoteResource } from '@sveltejs/kit';

export const images = ['image/png', 'image/jpeg'];

export const run = <T>(cb: () => T): T => {
  return cb();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type QueryResponse<T extends (...args: Any[]) => Any> =
  ReturnType<T> extends RemoteResource<infer R> ? R : undefined;

export type OmitId<T> = Omit<T, 'id'>;
