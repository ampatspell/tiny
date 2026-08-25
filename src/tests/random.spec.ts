import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { describe, it } from 'vitest';

describe('random', () => {
  it('hash', async () => {
    let password = 'hey';
    let salt = randomBytes(16).toString('hex');
    let hash = pbkdf2Sync(password, salt, 1000, 32, `sha512`).toString(`hex`);

    let synced = pbkdf2Sync(password, salt, 1000, 32, `sha512`).toString(`hex`);
    console.log(salt);
    console.log(hash);
    console.log(synced);
  });
});
