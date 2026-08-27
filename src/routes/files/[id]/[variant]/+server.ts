import { getFiles } from '$lib/tiny/server/services/getters.js';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { id, variant } }) => {
  return (await getFiles().get({ id, variant })).toResponse();
};
