import { useBroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { optionalPassword, requiredEmail, valibot } from '#lib/tiny/fields/models/validator.svelte.js';
import { getter, options, type OptionsInput } from '#lib/tiny/utils/options.svelte.js';
import { sentenceCase } from 'text-sentence-case';
import { roles, ValidRoleSchema } from '../../../env.ts';
import { updateUser, type UserData } from './users.remote.ts';

export type UseUserModelOptions = {
  data: UserData;
};

export const useUserModel = (_opts: OptionsInput<UseUserModelOptions>) => {
  const opts = options(_opts);
  const data = $derived(opts.data);
  const id = $derived(data.id);

  const broadcast = useBroadcastChannel();

  const fields = withDataFields({
    data: getter(() => ({ ...data, password: '' })),
  }).define(({ string, dropdown }) => {
    const items = roles.map((role) => {
      return { role, label: sentenceCase(role) };
    });
    return {
      email: string('email', { validator: requiredEmail }),
      role: dropdown('role', {
        items,
        identifier: 'role',
        validator: valibot({
          isRequired: true,
          schema: ValidRoleSchema,
        }),
      }),
      password: string('password', {
        label: 'New password',
        description: 'Leave blank to keep the current one',
        validator: optionalPassword,
        type: 'password',
      }),
    };
  });

  const save = async () => {
    if (fields.touch()) {
      const dirty = fields.serialized.dirty;
      if (dirty) {
        await updateUser({ id, ...dirty });
        fields.rollback();
        broadcast.notifyDidSave();
      }
    }
  };

  return fields.asEditable({
    save,
    route: null,
    title: getter(() => data.email),
  });
};
