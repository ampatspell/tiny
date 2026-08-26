import * as v from 'valibot';
import { command, getRequestEvent, query } from '$app/server';
import { getUsers } from '../services.ts';

export const signIn = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsers();
    const token = await users.token.create({ email, password });
    if (token) {
      getRequestEvent().cookies.set('tiny', token, { path: '/' });
      getCurrent().refresh();
    }
  },
);

export const signUp = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsers();
    await users.create({ email, password });
    await signIn({ email, password });
    getCurrent().refresh();
  },
);

export const getCurrent = query(async () => {
  const token = getRequestEvent().cookies.get('tiny');
  if (token) {
    return await getUsers().token.verify(token);
  }
});

export const signOut = command(async () => {
  getRequestEvent().cookies.delete('tiny', { path: '/' });
  getCurrent().refresh();
});
