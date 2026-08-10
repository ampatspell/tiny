import type { Database } from '#lib/cave/server/database/database.ts';
import type { Storage } from '#lib/cave/storage/storage.ts';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: Database;
      storage: Storage;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
