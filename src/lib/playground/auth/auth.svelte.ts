import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import { useDataProperties } from '$lib/tiny/properties/data.svelte.js';
import { notBlank } from '$lib/tiny/properties/validator.svelte.js';
import { signIn, signUp } from '$lib/tiny/auth/auth.remote.js';

export const useForm = (opts: {
  perform: (data: { email: string; password: string }) => Promise<void>;
  route: ResolvedPathname;
}) => {
  const properties = useDataProperties({ data: { email: '', password: '' } });
  const email = properties.property('email', { validator: notBlank() });
  const password = properties.property('password', { validator: notBlank() });

  const perform = async () => {
    if (properties.touch()) {
      await opts.perform(properties.data);
      goto(opts.route);
    }
  };

  return {
    email,
    password,
    perform,
  };
};

const route = resolve('/_admin/(content)');

export const useSignIn = () => useForm({ perform: (data) => signIn(data), route });
export const useSignUp = () => useForm({ perform: (data) => signUp(data), route });

export type FormOptions = {
  route: ResolvedPathname;
  perform: (data: { email: string; password: string }) => Promise<void>;
};
