import { invalidateAll } from '$app/navigation';
import { createContext } from 'svelte';
import { getToken } from './auth/auth.remote.ts';

const createBroadcastChannel = () => {
  const channel = new BroadcastChannel('tiny');

  channel.addEventListener('message', (e) => {
    try {
      const data = e.data;
      const json = JSON.parse(data);
      if (json.type === 'did-save') {
        void invalidateAll();
      } else if (json.type === 'token-did-change') {
        void getToken().refresh();
      }
    } catch (err) {
      console.error(err);
    }
  });

  const post = (opts: Record<string, unknown>) => {
    channel.postMessage(JSON.stringify(opts));
  };

  const notifyDidSave = () => {
    post({ type: 'did-save' });
  };

  const notifyTokenDidChange = () => {
    post({ type: 'token-did-change' });
  };

  return {
    notifyDidSave,
    notifyTokenDidChange,
  };
};

export type BroadcastChannel = ReturnType<typeof createBroadcastChannel>;

const [get, set] = createContext<BroadcastChannel>();

export const setBroadcastChannel = () => set(createBroadcastChannel());

export const useBroadcastChannel = get;
