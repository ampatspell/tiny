import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { BroadcastChannel } from '../broadcast.svelte.ts';
import { signIn as _signIn, signOut as _signOut, signUp as _signUp } from './auth.remote.ts';

const withCredentials = (cb: (opts: { email: string; password: string }) => Promise<boolean>) => {
  return async ({ channel, email, password }: { channel: BroadcastChannel; email: string; password: string }) => {
    if (await cb({ email, password })) {
      channel.notifyTokenDidChange();
      return true;
    }
    return false;
  };
};

export const signIn = withCredentials(_signIn);
export const signUp = withCredentials(_signUp);

export const signOut = async ({ channel }: { channel: BroadcastChannel }) => {
  await goto(resolve('/'));
  await _signOut();
  channel.notifyTokenDidChange();
};
