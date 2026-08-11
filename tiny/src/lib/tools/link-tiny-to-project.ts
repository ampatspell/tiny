import { x } from 'tinyexec';
import type { Project } from './project.ts';
import { outro } from '@clack/prompts';

export const linkTinyToProject = async (tiny: Project, project: Project) => {
  {
    const { exitCode } = await x('npm', ['link'], { nodeOptions: { cwd: tiny.root } });
    if (exitCode !== 0) {
      outro('Failed to link local tiny');
      process.exit(1);
    }
  }
  {
    const { exitCode } = await x('npm', ['link', '@ampatspell/tiny'], { nodeOptions: { cwd: project.root } });
    if (exitCode === 0) {
      outro(`npm linked tiny to ${project.name}`);
    } else {
      outro(`Failed to link tiny to ${project.name}`);
    }
  }
};
