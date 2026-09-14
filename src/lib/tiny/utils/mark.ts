import type { Snippet } from 'svelte';
import type { Any } from './utils.ts';

type _Function = (...args: unknown[]) => unknown;
type _Snippet = Snippet<Any>;

export const markFunction = <T extends _Function>(value: T) => ({
  type: 'function' as const,
  value,
});

export const markSnippet = <T extends _Snippet>(value: T) => ({
  type: 'snippet' as const,
  value,
});

export type MarkedFunction<T extends _Function> = ReturnType<typeof markFunction<T>>;
export type MarkedSnippet<T extends _Snippet> = ReturnType<typeof markSnippet<T>>;
