import { getFiles } from '#lib/tiny/server/services/getters.js';
import { uid } from '#lib/tiny/server/utils.js';
import { error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
  const blob = await event.request.blob();
  const { type } = blob;
  const name = event.request.headers.get('name');
  if (name && type) {
    const file = new File([blob], name, { type });
    const id = uid();
    await getFiles().file(id).store(file);
    return Response.json({ id });
  }
  return error(500);
};
