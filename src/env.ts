import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const roles = ['admin', 'subscriber'] as const;
export const ValidRoleSchema = v.pipe(v.string(), v.picklist(roles, 'Valid role is required'));

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
