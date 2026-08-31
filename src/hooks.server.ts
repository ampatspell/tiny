// @ts-expect-error missing type atm
import { STORAGE_ROOT, USERS_SECRET } from '$app/env/private';
import { jpeg } from '#lib/tiny/server/files/thumbnails.js';
import { createHandle } from '#lib/tiny/server/services/handle.js';
import { createBasicLogger } from '#lib/tiny/server/utils.js';
import { sequence } from '@sveltejs/kit/hooks';

const services = createHandle({
  dir: STORAGE_ROOT,
  users: {
    secret: USERS_SECRET,
  },
  files: {
    thumbnails: [jpeg({ size: 100 }), jpeg({ size: 1024 }), jpeg({ size: 2048 })],
  },
  logger: createBasicLogger(),
});

export const handle = sequence(services);
