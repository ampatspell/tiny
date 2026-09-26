import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { getUsers } from '../services/getters.ts';
import type { TokenPayload } from './users.ts';

export type GetTokenResponse =
  | {
      status: 'success';
      token: TokenPayload;
    }
  | {
      status: 'anonymous';
    }
  | {
      status: 'needs-refresh';
    };

export class UsersForRequestEventService {
  private readonly cookie = {
    name: 'tiny',
    opts: {
      path: '/',
    },
  };

  async signIn({ email, password }: { email: string; password: string }) {
    const {
      cookie: { name, opts },
    } = this;

    const event = getRequestEvent();
    const users = getUsers();
    const payload = await users.token.create({ email, password });
    if (payload) {
      // 1 year
      event.cookies.set(name, payload, { ...opts, maxAge: 60 * 60 * 24 * 365, sameSite: 'strict' });
      return payload;
    }
  }

  async signUp({ email, password }: { email: string; password: string }) {
    const users = getUsers();
    if (await users.create({ email, password })) {
      return await this.signIn({ email, password });
    }
  }

  async signOut() {
    const {
      cookie: { name, opts },
    } = this;

    const event = getRequestEvent();
    event.cookies.delete(name, opts);
  }

  async getToken(): Promise<GetTokenResponse> {
    const event = getRequestEvent();
    const res = event.locals.tiny.token;
    if (res) {
      return res;
    }

    const set = (res: GetTokenResponse) => {
      event.locals.tiny.token = res;
      return res;
    };

    const payload = event.cookies.get(this.cookie.name);
    if (payload) {
      const users = getUsers();
      const res = await users.token.verify(payload);
      if (res.status === 'success') {
        const token = res.token;
        console.log('[jwt]', token.email, token.role);
        return set({
          status: 'success',
          token,
        });
      } else if (res.status === 'error') {
        console.log('[jwt]', res.reason);
        if (res.reason === 'role') {
          return set({ status: 'needs-refresh' });
        }
      }
    }
    return set({ status: 'anonymous' });
  }
}

export const getUsersForRequestEvent = () => {
  return new UsersForRequestEventService();
};

export const assertToken = async (
  cb: (token: TokenPayload) => Promise<true | string> | true | string,
): Promise<void> => {
  const tokenResponse = await getUsersForRequestEvent().getToken();
  if (tokenResponse.status === 'success') {
    const resolved = await cb(tokenResponse.token);
    if (resolved === true) {
      return;
    } else {
      return error(403, resolved);
    }
  } else {
    return error(403, 'Not signed in');
  }
};

export const assertRole = async (role: Tiny.Role) => {
  return await assertToken((token) => {
    return token.role === role || 'Role does not match required';
  });
};

export const assertId = async (id: string) => {
  return assertToken((token) => {
    return token.id === id || 'User id does not match';
  });
};
