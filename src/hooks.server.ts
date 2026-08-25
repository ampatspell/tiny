import { STORAGE_ROOT } from '$app/env/private';
import { jpeg } from '$lib/tiny/server/files/thumbnails.js';
import { createHandle } from '$lib/tiny/server/services/handle.js';
import { createBasicLogger } from '$lib/tiny/server/utils.js';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const services = createHandle({
  dir: STORAGE_ROOT,
  files: {
    thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 }), jpeg({ size: 2048 })],
  },
  logger: createBasicLogger(),
});

const createAuth = (): Handle => {
  return async ({ event, resolve }) => {
    return await resolve(event);
  };
};

const auth = createAuth();

export const handle = sequence(services, auth);
