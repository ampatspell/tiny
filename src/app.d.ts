import type { Database } from '#lib/cave/kysely/database.ts';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      db: Database;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
