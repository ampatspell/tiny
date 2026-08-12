import { getFiles } from '@ampatspell/tiny/server/handle';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ params: { id } }) => getFiles().stream({ id });
