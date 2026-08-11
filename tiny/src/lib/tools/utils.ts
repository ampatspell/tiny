import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const loadPackageJSON = async (dir: string) => {
  return JSON.parse(await readFile(join(dir, 'package.json'), 'utf-8'));
};
