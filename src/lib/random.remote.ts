import { query } from '$app/server';
import { uid } from './utils';

export const getUid = query(async () => {
  return {
    uid: uid(),
  };
});
