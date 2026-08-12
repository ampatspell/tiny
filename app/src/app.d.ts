// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from '@ampatspell/tiny/server/database';
import type { Files } from '@ampatspell/tiny/server/files';
import type { Storage } from '@ampatspell/tiny/server/storage';

// for information about these interfaces
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
