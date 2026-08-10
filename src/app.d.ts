import type { Database } from '#lib/cave/server/database/database';
import type { Files } from '#lib/cave/server/files';
import type { Storage } from '#lib/cave/storage/storage';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: Database;
      storage: Storage;
      files: Files;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
