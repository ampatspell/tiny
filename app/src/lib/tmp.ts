import { getRequestEvent } from '$app/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDatabase = () => getRequestEvent().locals.db as any;
