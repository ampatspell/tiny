import type { Database } from '#lib/next/database/server/database.ts';
import type { Files } from '#lib/next/files/server/files.ts';
import type { Storage } from '#lib/next/storage/server/storage.ts';
import type { Users } from '#lib/tiny/server/users/users.ts';
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
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace Tiny {
    export type Thumbnail = Variant;
    export type Role = 'admin' | 'subscriber';
  }
}

export {};
