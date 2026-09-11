import * as v from 'valibot';

export const NotBlankSchema = v.pipe(
  v.string(),
  v.nonEmpty('Should not be blank'),
  v.check((value) => value === value.trim(), 'Should not have whitespace'),
);
export const EmptyStringSchema = v.pipe(v.string(), v.empty());
export const PermalinkSchema = v.pipe(v.string(), NotBlankSchema, v.regex(/^[a-z0-9-]+$/));
export const OptionalPermalinkSchema = v.union([EmptyStringSchema, PermalinkSchema], 'Should be just a-z, 0-9, -');
export const RequiredEmailSchema = v.pipe(NotBlankSchema, v.email('Should be an email'));
export const ProperPasswordSchema = v.pipe(
  NotBlankSchema,
  v.minLength(4, 'Should be min 4 chars'),
  v.maxLength(250, 'Way too long'),
);
