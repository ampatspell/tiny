// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from '$lib/server/database/database.ts';
import type { Files } from '$lib/server/files.ts';
import type { Storage } from '$lib/server/storage.ts';

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
