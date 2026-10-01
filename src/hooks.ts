import * as v from 'valibot';

export const roles = ['admin', 'subscriber'] as const;
export const ValidRoleSchema = v.pipe(v.string(), v.picklist(roles, 'Valid role is required'));
