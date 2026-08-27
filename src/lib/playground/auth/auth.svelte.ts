import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { useDataProperties } from '$lib/tiny/properties/data.svelte.js';
import { notBlank } from '$lib/tiny/properties/validator.svelte.js';
import { signIn, signUp } from './auth.remote.ts';

export const useForm = (opts: { perform: (data: { email: string; password: string }) => Promise<void> }) => {
  const properties = useDataProperties({ data: { email: '', password: '' } });
  const email = properties.property('email', { validator: notBlank() });
  const password = properties.property('password', { validator: notBlank() });

  const perform = async () => {
    if (properties.touch()) {
      await opts.perform(properties.data);
      goto(resolve('/_admin/(content)'));
    }
  };

  return {
    email,
    password,
    perform,
  };
};

export const useSignIn = () => useForm({ perform: (data) => signIn(data) });
export const useSignUp = () => useForm({ perform: (data) => signUp(data) });
