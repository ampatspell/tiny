import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { getUsers } from '../services/getters.ts';

export const getUsersForRequestEvent = () => {
  const name = 'tiny';
  const opts = {
    path: '/',
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const event = getRequestEvent();
    const users = getUsers();
    const payload = await users.token.create({ email, password });
    if (payload) {
      event.cookies.set(name, payload, opts);
      return payload;
    }
  };

  const signUp = async ({ email, password }: { email: string; password: string }) => {
    const users = getUsers();
    await users.create({ email, password });
    return await signIn({ email, password });
  };

  const signOut = async () => {
    const event = getRequestEvent();
    event.cookies.delete(name, opts);
  };

  const getToken = async () => {
    const event = getRequestEvent();
    const users = getUsers();
    const payload = event.cookies.get(name);
    if (payload) {
      return await users.token.verify(payload);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    getToken,
  };
};

export const assertRole = async (role: string) => {
  const token = await getUsersForRequestEvent().getToken();
  if (token?.role !== role) {
    if (token) {
      error(403, { message: 'Role does not match required' });
    } else {
      error(403, { message: 'Not signed in' });
    }
  }
};

export const assertId = async (id: string) => {
  const token = await getUsersForRequestEvent().getToken();
  if (token?.id !== id) {
    if (token) {
      error(403, { message: 'User id does not match' });
    } else {
      error(403, { message: 'Not signed in' });
    }
  }
};
