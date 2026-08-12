import { randomBytes } from 'node:crypto';

export const uid = (length = 16) => {
  return randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
    .slice(0, length);
};
