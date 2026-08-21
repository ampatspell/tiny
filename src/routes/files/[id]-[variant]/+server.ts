import { getFiles } from '$lib/playground/services.js';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params: { id, variant } }) => getFiles().stream({ id, variant });
