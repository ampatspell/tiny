import { randomBytes } from 'node:crypto';

export const uid = (length = 16) => {
  return randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
    .slice(0, length);
};

export type Logger = {
  info: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
};

export const createBasicLogger = (): Logger => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrap = (next: (...args: any[]) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (first: any, ...rest: any[]) => {
      next(`[${first}]`, ...rest);
    };
  };
  const info = wrap(console.info);
  const error = wrap(console.error);
  return {
    info,
    error,
  };
};
