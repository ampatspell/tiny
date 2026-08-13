import * as v from 'valibot';
import { defineEnvVars } from '@sveltejs/kit/env';
import { building } from '$app/env';

export const variables = defineEnvVars({
  STORAGE_ROOT: {
    schema: building ? v.optional(v.string()) : v.string(),
  },
});
