// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Database } from '$lib/next/database/server/database.ts';
import type { Files } from '$lib/next/files/server/files.ts';
import type { Storage } from '$lib/next/storage/server/storage.ts';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      tiny: {
        db: Database;
        storage: Storage;
        files: Files;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
