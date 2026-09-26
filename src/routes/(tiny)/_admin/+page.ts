import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = () => {
  redirect(307, resolve('/(tiny)/_admin/(nav)/dashboard'));
};
