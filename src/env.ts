import * as v from 'valibot';
import { defineEnvVars } from '@sveltejs/kit/env';
import { building } from '$app/env';

const string = () => {
  return building ? v.optional(v.string()) : v.string();
};

export const variables = defineEnvVars({
  STORAGE_ROOT: {
    schema: string(),
  },
  USERS_SECRET: {
    schema: string(),
  },
});
