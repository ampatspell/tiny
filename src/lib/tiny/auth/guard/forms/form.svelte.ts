import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import { useBroadcastChannel, type BroadcastChannel } from '$lib/tiny/broadcast.svelte.js';
import { useDataFields } from '$lib/tiny/fields/data.svelte.js';
import { notBlank } from '$lib/tiny/properties/validator.svelte.js';
import { signIn, signUp } from '../../auth.svelte.ts';

export const useForm = (opts: {
  perform: (data: { channel: BroadcastChannel; email: string; password: string }) => Promise<void>;
  route: ResolvedPathname;
}) => {
  const channel = useBroadcastChannel();

  const fields = useDataFields({
    data: {
      email: '',
      password: '',
    },
  });

  const email = fields.field.string('email', { validator: notBlank() });
  const password = fields.field.string('password', { validator: notBlank(), type: 'password' });

  const perform = async () => {
    if (fields.touch()) {
      await opts.perform({ channel, ...fields.data });
      goto(opts.route);
    }
  };

  return {
    email,
    password,
    perform,
  };
};

// TODO: route
const route = resolve('/(tiny)/_admin/(nav)');

export const useSignIn = () => useForm({ perform: (data) => signIn(data), route });
export const useSignUp = () => useForm({ perform: (data) => signUp(data), route });

export type FormOptions = {
  route: ResolvedPathname;
  perform: (data: { email: string; password: string }) => Promise<void>;
};
