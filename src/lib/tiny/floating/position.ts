import { browser } from '$app/env';
import {
  flip,
  offset as _offset,
  shift,
  type ComputePositionConfig,
  type Middleware,
  type MiddlewareReturn,
  type OffsetOptions,
  type Placement,
} from '@floating-ui/dom';

export const basic = (opts?: { placement?: Placement; offset?: OffsetOptions }): ComputePositionConfig => {
  const { placement = 'bottom-start', offset = 3 } = opts ?? {};
  return {
    placement,
    middleware: [_offset(offset), flip(), shift({ padding: 5 })],
  };
};

let pos = { x: 0, y: 0 };

if (browser) {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    pos = { x, y };
  });
}

export const mouse = (): ComputePositionConfig => {
  const middleware: Middleware = {
    name: 'mouse',
    fn: async (): Promise<MiddlewareReturn> => {
      return pos;
    },
  };
  return {
    placement: 'bottom-start',
    middleware: [middleware, _offset(10), flip(), shift({ padding: 5 })],
  };
};
