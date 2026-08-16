import { addObject, removeObject } from '$lib/utils/array.js';
import { defer, type Deferred } from '$lib/utils/promise.js';
import { extract, type MaybeGetter } from 'runed';
import { createContext, tick, type Snippet } from 'svelte';

export type FloaterOptions<Req, Res> = FloaterOpenOptions<Req, Res> & {
  onClosed: (floater: Floater<Req, Res>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Floater<Req = any, Res = any> {
  private readonly _opts: FloaterOptions<Req, Res>;
  private _deferred: Deferred<Res>;

  constructor(opts: FloaterOptions<Req, Res>) {
    this._opts = opts;
    this._deferred = defer<Res>();
  }

  get snippet() {
    return this._opts.snippet;
  }

  readonly resolve = (opts: Res) => {
    this._deferred.resolve(opts);
    this._opts.onClosed(this);
  };

  readonly close = () => {
    const close = extract(this._opts.close);
    if (close !== undefined) {
      this.resolve(close);
    }
  };

  get opts(): {
    request: Req;
    resolve: (resolution: Res) => void;
    close: () => void;
  } {
    const { request } = this._opts;
    const { resolve, close } = this;
    return {
      request,
      resolve,
      close,
    };
  }

  get response() {
    return this._deferred.promise;
  }
}

export type FloaterOpenOptions<Req, Res> = {
  relative: () => HTMLElement | undefined;
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
  constructor() {}

  all = $state<Floater[]>([]);

  private readonly onClosed = async (floater: Floater) => {
    await tick();
    removeObject(this.all, floater);
  };

  readonly open = <Req, Res>({ relative, snippet, request, close }: FloaterOpenOptions<Req, Res>) => {
    const { onClosed } = this;
    const floater = new Floater({ relative, snippet, request, close, onClosed });
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
