import * as v from 'valibot';
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  STORAGE_ROOT: { public: false, static: true, schema: v.string() },
});
