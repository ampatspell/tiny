import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { BroadcastChannel } from '../broadcast.svelte.ts';
import { signIn as _signIn, signOut as _signOut, signUp as _signUp } from './auth.remote.ts';

export const signIn = async ({
  channel,
  email,
  password,
}: {
  channel: BroadcastChannel;
  email: string;
  password: string;
}) => {
  if (await _signIn({ email, password })) {
    channel.notifyTokenDidChange();
    return true;
  }
  return false;
};

export const signUp = async ({
  channel,
  email,
  password,
}: {
  channel: BroadcastChannel;
  email: string;
  password: string;
}) => {
  if (await _signUp({ email, password })) {
    channel.notifyTokenDidChange();
    return true;
  }
  return false;
};

export const signOut = async ({ channel }: { channel: BroadcastChannel }) => {
  await goto(resolve('/'));
  await _signOut();
  channel.notifyTokenDidChange();
};
