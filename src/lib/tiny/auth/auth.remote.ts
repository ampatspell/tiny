import * as v from 'valibot';
import { command, getRequestEvent, query } from '$app/server';
import { getUsers } from '../server/services/getters.ts';

export const signIn = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsers();
    if (await users.request(getRequestEvent()).signIn({ email, password })) {
      getToken().refresh();
    }
  },
);

export const signUp = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    if (await getUsers().request(getRequestEvent()).signUp({ email, password })) {
      getToken().refresh();
    }
  },
);

export const signOut = command(async () => {
  await getUsers().request(getRequestEvent()).signOut();
  getToken().refresh();
});

export const getToken = query(async () => {
  return getUsers().request(getRequestEvent()).getToken();
});
