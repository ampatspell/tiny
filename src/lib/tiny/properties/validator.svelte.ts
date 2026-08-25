import type { Validator } from './property.svelte.ts';

export const notBlank = (): Validator<string> => {
  return {
    isRequired: true,
    validate: (string) => {
      if (string.trim().length === 0) {
        return 'Should not be blank';
      }
    },
  };
};
