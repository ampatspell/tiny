import { useBroadcastChannel, type BroadcastChannel } from '#lib/tiny/broadcast.svelte.js';
import { withDataFields } from '#lib/tiny/fields/index.svelte.js';
import { properPassword, requiredEmail } from '#lib/tiny/fields/models/validator.svelte.js';
import { getter } from '#lib/tiny/utils/options.svelte.js';
import { signIn, signUp } from '../../utils.svelte.ts';

export const useForm = (opts: {
  error: string;
  perform: (data: { channel: BroadcastChannel; email: string; password: string }) => Promise<boolean>;
}) => {
  const channel = useBroadcastChannel();

  const model = withDataFields({
    data: {
      email: '',
      password: '',
    },
  }).define(({ string }) => ({
    email: string('email', { validator: requiredEmail, autofocus: true }),
    password: string('password', { validator: properPassword, type: 'password' }),
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
  });

export const useSignUp = () =>
  useForm({
    perform: (data) => signUp(data),
    error: 'Email already taken.',
  });
