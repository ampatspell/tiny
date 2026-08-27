import * as v from 'valibot';
import { command, query } from '$app/server';
import { getUsers } from '../server/services/getters.ts';
import { redirect } from '@sveltejs/kit';

export const signIn = command(
  v.strictObject({
    email: v.string(),
    password: v.string(),
  }),
  async ({ email, password }) => {
    const users = getUsers();
    if (await users.request.signIn({ email, password })) {
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
    if (await getUsers().request.signUp({ email, password })) {
      getToken().refresh();
    }
  },
);

export const signOut = command(async () => {
  await getUsers().request.signOut();
  getToken().refresh();
});

export const getToken = query(async () => {
  return getUsers().request.getToken();
});
