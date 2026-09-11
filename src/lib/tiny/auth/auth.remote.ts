import { command, query } from '$app/server';
import * as v from 'valibot';
import { getUsersForRequestEvent } from '../server/users/request-event.ts';

export const signIn = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsersForRequestEvent();
    if (await users.signIn({ email, password })) {
      getToken().refresh();
      return true;
    }
    return false;
  },
);

export const signUp = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsersForRequestEvent();
    if (await users.signUp({ email, password })) {
      getToken().refresh();
      return true;
    }
    return false;
  },
);

export const signOut = command(async () => {
  const users = getUsersForRequestEvent();
  await users.signOut();
  getToken().refresh();
});

export const getToken = query(async () => {
  const users = getUsersForRequestEvent();
  return users.getToken();
});
