import type { FloaterOpenOptions } from '../floaters/model.svelte.ts';
import { defer, type Deferred } from '#lib/tiny/utils/promise.js';
import { type Any } from '#lib/tiny/utils/utils.js';
import { options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';

export type FloaterOptions<Req, Res> = FloaterOpenOptions<Req, Res> & {
  onClosed: (floater: Floater<Req, Res>) => void;
};

export class Floater<Req = Any, Res = Any> {
  private readonly _opts: FloaterOptions<Req, Res>;
  private _deferred: Deferred<Res>;

  constructor(opts: OptionsInput<FloaterOptions<Req, Res>>) {
    this._opts = options(opts);
    this._deferred = defer<Res>();
  }

  get position() {
    return this._opts.position;
  }

  get reference() {
    return this._opts.reference;
  }

  get snippet() {
    return this._opts.snippet;
  }

  readonly resolve = (opts: Res) => {
    this._deferred.resolve(opts);
    this._opts.onClosed(this);
  };

  readonly close = () => {
    const close = this._opts.close;
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
