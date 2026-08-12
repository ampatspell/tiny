import { getFiles } from '$lib/server/handle.js';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params: { id } }) => getFiles().stream({ id });
