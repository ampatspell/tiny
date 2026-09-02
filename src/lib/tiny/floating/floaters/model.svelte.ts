import { createContext, tick, type Snippet } from 'svelte';
import { Floater } from '../floater/model.svelte.ts';
import type { ComputePositionConfig } from '@floating-ui/dom';
import { addObject, removeObject } from '#lib/tiny/utils/array.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';

export type FloaterOpenOptions<Req, Res> = {
  reference: HTMLElement | undefined;
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
  close?: Res | undefined;
};

export class Floaters {
  readonly all = $state<Floater[]>([]);

  private readonly onClosed = async (floater: Floater) => {
    await tick();
    removeObject(this.all, floater);
  };

  readonly open = <Req, Res>(_opts: OptionsInput<FloaterOpenOptions<Req, Res>>) => {
    const opts = options(_opts);
    const { onClosed } = this;
    const floater = new Floater({
      reference: getter(() => opts.reference),
      position: getter(() => opts.position),
      snippet: getter(() => opts.snippet),
      request: getter(() => opts.request),
      close: getter(() => opts.close),
      onClosed,
    });
    addObject(this.all, floater);
    return floater;
  };
}

const [get, set] = createContext<Floaters>();

export const useFloaters = () => get();

export const setFloaters = () => {
  const floaters = new Floaters();
  return set(floaters);
};
