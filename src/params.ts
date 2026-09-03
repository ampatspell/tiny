import { defineParams } from '@sveltejs/kit/params';
import * as v from 'valibot';

const variants = v.union([v.literal('100x100'), v.literal('1024x1024'), v.literal('2048x2048')]);
export type Variants = v.InferInput<typeof variants>;

export const params = defineParams({
  variants,
});
