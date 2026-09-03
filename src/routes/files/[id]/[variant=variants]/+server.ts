import { getFiles } from '#lib/tiny/server/services/getters.js';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params }) => getFiles().handle(params);
