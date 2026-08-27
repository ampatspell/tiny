import { error, type RequestEvent } from '@sveltejs/kit';
import { getUsers } from '../services/getters.ts';

export const assertRole = async (event: RequestEvent, role: string) => {
  const token = await getUsers().request(event).getToken();
  if (token?.role !== role) {
    if (token) {
      error(403, { message: 'Role does not match required' });
    } else {
      error(403, { message: 'Not signed in' });
    }
  }
};

export const assertId = async (event: RequestEvent, id: string) => {
  const token = await getUsers().request(event).getToken();
  if (token?.id !== id) {
    if (token) {
      error(403, { message: 'User id does not match' });
    } else {
      error(403, { message: 'Not signed in' });
    }
  }
};
