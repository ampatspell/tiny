import {
  NotBlankSchema,
  OptionalPermalinkSchema,
  RequiredPasswordSchema,
  RequiredEmailSchema,
  OptionalPasswordSchema,
} from '#lib/tiny/utils/schema.js';
import { type Any } from '#lib/tiny/utils/utils.js';
import * as v from 'valibot';

export type Validator<T> = {
  validate: (value: T) => string | boolean | undefined;
  isRequired: boolean;
};

export const valibot = <T>({
  isRequired,
  schema,
}: {
  isRequired: boolean;
  schema: v.BaseSchema<T, Any, Any>;
}): Validator<T> => {
  const validate = (value: T) => {
    const result = v.safeParse(schema, value, { abortEarly: true, abortPipeEarly: true });
    if (!result.success) {
      const issues = v.flatten<typeof schema>(result.issues);
      const issue = issues.root?.[0];
      return issue ?? 'Is not valid';
    }
    return undefined;
  };
  return {
    validate,
    isRequired,
  };
};

export const notBlank = valibot({ isRequired: true, schema: NotBlankSchema });
export const optionalPermalink = valibot({ isRequired: false, schema: OptionalPermalinkSchema });
export const requiredEmail = valibot({ isRequired: true, schema: RequiredEmailSchema });
export const requiredPassword = valibot({ isRequired: true, schema: RequiredPasswordSchema });
export const optionalPassword = valibot({ isRequired: false, schema: v.optional(OptionalPasswordSchema) });
