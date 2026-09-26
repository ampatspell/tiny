import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

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
