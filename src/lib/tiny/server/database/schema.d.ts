import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export interface File {
  id: string;
  name: string;
}

export interface FileVariant {
  contentType: string;
  fileId: string;
  height: number | null;
  id: string;
  identifier: string;
  size: number;
  width: number | null;
}

export interface Gallery {
  id: string;
  name: Generated<string>;
  permalink: Generated<string>;
}

export interface Index {
  backgroundColor: string;
  backgroundId: string | null;
  backgroundOffset: number;
  description: string;
  id: string;
  indexBackgroundColor: string;
  indexTextColor: string;
  textColor: string;
  title: string;
}

export interface User {
  email: string;
  hash: string | null;
  id: string;
  role: string;
  salt: string | null;
}

export interface DB {
  files: File;
  fileVariants: FileVariant;
  galleries: Gallery;
  index: Index;
  users: User;
}
