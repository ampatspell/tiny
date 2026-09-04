// @ts-expect-error missing type atm
import { STORAGE_ROOT, USERS_SECRET } from '$app/env/private';
import { jpeg } from '#lib/tiny/server/files/thumbnails.js';
import { createHandle } from '#lib/tiny/server/services/handle.js';
import { createBasicLogger } from '#lib/tiny/server/utils.js';
import { sequence, type HandleServerError } from '@sveltejs/kit/hooks';
import { NoResultError } from 'kysely';

const services = createHandle({
  dir: STORAGE_ROOT,
  users: {
    secret: USERS_SECRET,
    roles: {
      admin: 'admin',
      default: 'subscriber',
    },
  },
  files: {
    thumbnails: {
      '100x100': jpeg({ size: 100 }),
      '1024x1024': jpeg({ size: 1024 }),
      '2048x2048': jpeg({ size: 2048 }),
    },
  },
  logger: createBasicLogger(),
});

export const handle = sequence(services);

export const handleError: HandleServerError = async ({ error }) => {
  if (error instanceof NoResultError) {
    return {
      status: 404,
      message: 'Not found',
    };
  }
  return error;
};
