import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { useDataProperties } from '$lib/tiny/properties/data.svelte.js';
import { notBlank } from '$lib/tiny/properties/validator.svelte.js';
import { getter } from '$lib/tiny/utils/options.svelte.js';
import { signIn, signUp } from './auth.remote.ts';

export const useSignIn = () => {
  const data = { email: '', password: '' };
  const properties = useDataProperties({ data: getter(() => data) });
  const email = properties.property('email', { validator: notBlank() });
  const password = properties.property('password', { validator: notBlank() });

  const perform = async () => {
    if (properties.touch()) {
      await signIn(properties.data);
      goto(resolve('/_admin/(content)'));
    }
  };

  return {
    email,
    password,
    perform,
  };
};

export const useSignUp = () => {
  const data = { email: '', password: '' };
  const properties = useDataProperties({ data: getter(() => data) });
  const email = properties.property('email', { validator: notBlank() });
  const password = properties.property('password', { validator: notBlank() });

  const perform = async () => {
    if (properties.touch()) {
      await signUp(properties.data);
      goto(resolve('/_admin/(content)'));
    }
  };

  return {
    email,
    password,
    perform,
  };
};
