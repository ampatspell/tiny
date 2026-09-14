import type { Snippet } from 'svelte';
import type { Any } from './utils.ts';

type _Function = (...args: unknown[]) => unknown;
type _Snippet = Snippet<Any>;

export const isFunction = <T extends _Function>(value: T) => ({
  type: 'function' as const,
  value,
});

export const isSnippet = <T extends _Snippet>(value: T) => ({
  type: 'snippet' as const,
  value,
});

export type IsFunction<T extends _Function> = ReturnType<typeof isFunction<T>>;
export type IsSnippet<T extends _Snippet> = ReturnType<typeof isSnippet<T>>;
