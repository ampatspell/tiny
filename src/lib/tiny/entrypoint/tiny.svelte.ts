import { createContext } from 'svelte';
import { options, type OptionsInput } from '../utils/options.svelte.ts';
import type { ValidateFunction } from '../auth/guard/validate.svelte.ts';
import { setBroadcastChannel } from '../broadcast.svelte.ts';
import type { ResolvedPathname } from '$app/types';
import { setFiles } from '../files.svelte.ts';

export type CreateTinyOptions = {
  guard?: ValidateFunction | undefined;
  files: {
    resolve: (opts: { id: string; variant: Tiny.FileVariant }) => ResolvedPathname;
  };
};

const createTiny = (_opts: OptionsInput<CreateTinyOptions>) => {
  setBroadcastChannel();

  return options(
    {
      validate: _opts.guard,
      files: _opts.files,
    },
    { name: 'Tiny' },
  );
};

export type TinyContext = ReturnType<typeof createTiny>;

const [get, set] = createContext<TinyContext>();

export const setTiny = (...args: Parameters<typeof createTiny>) => {
  set(createTiny(...args));
  setFiles();
};

export const useTiny = () => get();
