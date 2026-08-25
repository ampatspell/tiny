import { extract } from 'runed';
import type { FloaterOpenOptions } from './floaters.svelte.ts';
import { defer, type Deferred } from '$lib/tiny/utils/promise.js';

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

  get position() {
    return this._opts.position;
  }

  get reference() {
    return this._opts.reference();
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
