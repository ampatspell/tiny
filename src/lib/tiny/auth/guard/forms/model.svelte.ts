import { useBroadcastChannel, type BroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { requiredPassword, requiredEmail } from '#lib/tiny/fields/models/validator.svelte.js';
import type { InputAutocomplete } from '#lib/tiny/input.svelte';
import { getter } from '#lib/tiny/utils/options.svelte.js';
import { signIn, signUp } from '../../utils.svelte.ts';

export const useForm = (opts: {
  error: string;
  autocomplete: { email: InputAutocomplete; password: InputAutocomplete };
  perform: (data: { channel: BroadcastChannel; email: string; password: string }) => Promise<boolean>;
}) => {
  const channel = useBroadcastChannel();

  const model = withDataFields({
    data: {
      email: '',
      password: '',
    },
  }).define(({ string }) => ({
    email: string('email', {
      validator: requiredEmail,
      autofocus: true,
      autocomplete: opts.autocomplete.email,
    }),
    password: string('password', {
      validator: requiredPassword,
      type: 'password',
      autocomplete: opts.autocomplete.password,
    }),
  }));

  let isError = $state(false);

  const perform = async () => {
    if (model.touch()) {
      isError = false;
      if (!(await opts.perform({ channel, ...model.serialized.all }))) {
        isError = true;
      }
    }
  };

  const error = $derived(isError ? opts.error : undefined);

  return model.asEditable({
    perform,
    error: getter(() => error),
  });
};

export type UseForm = ReturnType<typeof useForm>;

export const useSignIn = () =>
  useForm({
    perform: (data) => signIn(data),
    error: 'Incorrect email or password.',
    autocomplete: {
      email: 'email',
      password: 'current-password',
    },
  });

export const useSignUp = () =>
  useForm({
    perform: (data) => signUp(data),
    error: 'Email already taken.',
    autocomplete: {
      email: 'email',
      password: 'new-password',
    },
  });
