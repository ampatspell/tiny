import { useBroadcastChannel, type BroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withDataFields } from '#lib/tiny/fields-3/fields-definition.svelte.js';
import { notBlank } from '#lib/tiny/fields/validator.svelte.js';
import type { ResolvedPathname } from '$app/types';
import { signIn, signUp } from '../../utils.svelte.ts';

export const useForm = (opts: {
  perform: (data: { channel: BroadcastChannel; email: string; password: string }) => Promise<void>;
}) => {
  const channel = useBroadcastChannel();

  const model = withDataFields({
    data: {
      email: '',
      password: '',
    },
  }).define(({ string }) => ({
    email: string('email', { validator: notBlank() }),
    password: string('password', { validator: notBlank(), type: 'password' }),
  }));

  const perform = async () => {
    if (model.touch()) {
      await opts.perform({ channel, ...model.serialized.all });
    }
  };

  return {
    ...model.record,
    perform,
  };
};

export type UseForm = ReturnType<typeof useForm>;

export const useSignIn = () => useForm({ perform: (data) => signIn(data) });
export const useSignUp = () => useForm({ perform: (data) => signUp(data) });

export type FormOptions = {
  route: ResolvedPathname;
  perform: (data: { email: string; password: string }) => Promise<void>;
};
