import * as v from 'valibot';
import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  STORAGE_PATH: { public: false, schema: v.string() },
});
