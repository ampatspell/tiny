import { intro, log, outro } from '@clack/prompts';
import { copy, exists } from 'fs-extra';
import { readdir, realpath, writeFile } from 'fs/promises';
import { join, parse, resolve } from 'path';
import { x } from 'tinyexec';
import { loadPackageJSON } from './utils.ts';
import { createConsumerProjectImpl, createProject, createTinyProjectImpl, type Project } from './project.ts';
import { bootstrapProject, generateMigrationFile } from './generate.ts';

const findRoot = async (current: string) => {
  if (await exists(join(current, 'package.json'))) {
    return current;
  }
  const { dir: parent } = parse(current);
  if (current !== parent) {
    return findRoot(parent);
  }
};

const lookupTiny = async (dir: string) => {
  const { exitCode, stdout } = await x('npm', ['ls', '-p', '@ampatspell/tiny'], { nodeOptions: { cwd: dir } });
  if (exitCode === 0) {
    return resolve(await realpath(stdout.trim()));
  }
};

const copyMigrations = async (source: Project, target: Project) => {
  const sources = await readdir(source.migrationsRoot);
  for (const path of sources) {
    if (parse(path).ext === '.ts' && path.includes('-tiny-')) {
      await copy(join(source.migrationsRoot, path), join(target.migrationsRoot, path), { preserveTimestamps: true });
    }
  }
};

export const createTools = async (opts: { cwd: string }) => {
  intro('Tiny');
  const root = await findRoot(opts.cwd);
  if (!root) {
    log.error(`Failed to lookup project directory starting from ${opts.cwd}`);
    return;
  }

  const pkg = await loadPackageJSON(root);

  if (typeof pkg?.name !== 'string') {
    log.error(`Failed to lookup project name from package.json`);
    return;
  }

  let tiny;
  let project;

  if (pkg.name === '@ampatspell/tiny') {
    tiny = await createProject({ impl: await createTinyProjectImpl({ root }) });
    project = tiny;
  } else {
    const tinyRoot = await lookupTiny(root);
    if (!tinyRoot) {
      log.error('Cannot resolve @ampatspell/tiny location from package.json');
      return;
    }
    tiny = await createProject({ impl: await createTinyProjectImpl({ root: tinyRoot }) });
    project = await createProject({ impl: await createConsumerProjectImpl({ root }) });
  }

  log.info([project.name, project.root].join('\n'));

  if (project.env) {
    log.info(['.env', `STORAGE_ROOT=${project.env.storageRoot}`].join('\n'));
  }

  if (!project.isTiny) {
    await copyMigrations(tiny, project);
  }

  const commands = {
    generateNewMigrationFile: () => generateMigrationFile(project),
    generateSchemaFromDatabase: async () => {
      await project.withServices(async (services) => {
        const schema = await services.database.schema.generate();
        await writeFile(join(project.schemaRoot, 'schema.d.ts'), schema, 'utf8');
        outro('Done');
      });
    },
    migrateDatabaseToLatest: async () => {
      await project.withServices(async (services) => {
        await services.database.migrate({ migrations: project.migrationsRoot }).toLatest();
      });
      outro('Done');
    },
    bootstrapProject: () => bootstrapProject(project),
  };

  return {
    tiny,
    project,
    commands,
  };
};
