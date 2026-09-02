import type { ResolvedPathname } from '$app/types';
import { useBroadcastChannel, type BroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { notBlank } from '#lib/tiny/properties/validator.svelte.js';
import { signIn, signUp } from '../../utils.svelte.ts';
import { withDataFields } from '#lib/tiny/fields/data.svelte.js';

export const useForm = (opts: {
  perform: (data: { channel: BroadcastChannel; email: string; password: string }) => Promise<void>;
}) => {
  const channel = useBroadcastChannel();

  const [fields, state] = withDataFields({
    data: {
      email: '',
      password: '',
    },
  }).define(({ string }) => ({
    email: string('email', { validator: notBlank() }),
    password: string('password', { validator: notBlank(), type: 'password' }),
  }));

  const perform = async () => {
    if (state.touch()) {
      await opts.perform({ channel, ...state.serialized.all });
    }
  };

  return {
    ...fields,
    perform,
  };
};

export const useSignIn = () => useForm({ perform: (data) => signIn(data) });
export const useSignUp = () => useForm({ perform: (data) => signUp(data) });

export type FormOptions = {
  route: ResolvedPathname;
  perform: (data: { email: string; password: string }) => Promise<void>;
};
