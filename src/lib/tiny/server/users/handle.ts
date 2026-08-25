import type { Handle } from '@sveltejs/kit';

export const createAuth = (): Handle => {
  return async ({ event, resolve }) => {
    return await resolve(event);
  };
};
