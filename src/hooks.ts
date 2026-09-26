import { setupPolyfills } from '#lib/tiny/polyfills.js';
import * as v from 'valibot';

setupPolyfills();

export const roles = ['admin', 'subscriber'] as const;
export const ValidRoleSchema = v.pipe(v.string(), v.picklist(roles, 'Valid role is required'));
