export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: boolean;
};

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
