import { defineParams } from '@sveltejs/kit/params';
import * as v from 'valibot';

export const params = defineParams({
  variants: v.union([v.literal('100x100'), v.literal('1024x1024'), v.literal('2048x2048')]),
});
