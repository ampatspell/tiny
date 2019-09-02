import { run, schedule } from '@ember/runloop';

export const action = fn => run(() => schedule('actions', fn));
