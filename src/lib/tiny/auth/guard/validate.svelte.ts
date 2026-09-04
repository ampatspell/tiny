import type { TokenPayload } from '#lib/tiny/server/users/users.js';
import type { Page } from '$app/state';

export type ValidateOptions = {
  url: Page['url'];
  token: TokenPayload | undefined;
};

export type ValidateResolution = 'allowed' | 'sign-in' | 'denied';

export type ValidateFunction = (opts: ValidateOptions) => ValidateResolution;

export const validatePrefix = ({ prefix, role }: { prefix: string; role: Tiny.Role }) => {
  return (opts: ValidateOptions): ValidateResolution => {
    if (opts.url.pathname.startsWith(prefix)) {
      if (!opts.token) {
        return 'sign-in';
      } else if (opts.token.role !== role) {
        return 'denied';
      }
    }
    return 'allowed';
  };
};
