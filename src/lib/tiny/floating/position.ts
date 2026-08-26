import { browser } from '$app/env';
import {
  flip,
  offset,
  shift,
  type ComputePositionConfig,
  type Middleware,
  type MiddlewareReturn,
} from '@floating-ui/dom';

export const basic = (): ComputePositionConfig => {
  return {
    placement: 'bottom-start',
    middleware: [offset(3), flip(), shift({ padding: 5 })],
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
    middleware: [middleware, offset(10), flip(), shift({ padding: 5 })],
  };
};
