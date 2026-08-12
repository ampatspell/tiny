import { getFiles } from '$lib/handle';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params: { id } }) => getFiles().stream({ id });
