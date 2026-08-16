import { addObject, removeObject } from '$lib/utils/array.js';
import type { MaybeGetter } from 'runed';
import { createContext, tick, type Snippet } from 'svelte';
import { Floater } from './floater.svelte.ts';
import type { ComputePositionConfig } from '@floating-ui/dom';

export type FloaterOpenOptions<Req, Res> = {
  reference: () => HTMLElement | undefined;
  position: ComputePositionConfig;
  snippet: Snippet<
    [
      {
        request: Req;
        resolve: (res: Res) => void;
        close: () => void;
      },
    ]
  >;
  request: NoInfer<Req>;
  close?: MaybeGetter<Res | undefined>;
};

export class Floaters {
  readonly all = $state<Floater[]>([]);

  private readonly onClosed = async (floater: Floater) => {
    await tick();
    removeObject(this.all, floater);
  };

  readonly open = <Req, Res>({ reference, position, snippet, request, close }: FloaterOpenOptions<Req, Res>) => {
    const { onClosed } = this;
    const floater = new Floater({ reference, position, snippet, request, close, onClosed });
    addObject(this.all, floater);
    return floater;
  };
}

const [get, set] = createContext<Floaters>();

export const useFloaters = () => get();

export const createFloaters = () => {
  const floaters = new Floaters();
  return set(floaters);
};
