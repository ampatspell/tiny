import type { Database } from '#lib/tiny/server/database/database.ts';
import type { Files } from '#lib/tiny/server/files/files.ts';
import type { Storage } from '#lib/tiny/server/storage/storage.ts';
import type { GetTokenResponse } from '#lib/tiny/server/users/request-event.ts';
import type { Users } from '#lib/tiny/server/users/users.ts';
import type { roles } from './env.ts';
import type { Variant } from './params.ts';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      tiny: {
        db: Database;
        storage: Storage;
        files: Files;
        users: Users;
        token: GetTokenResponse | undefined;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace Tiny {
    export type Thumbnail = Variant;
    export type Role = (typeof roles)[number];
  }
}

export {};
