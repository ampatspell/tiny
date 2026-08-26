import { invalidateAll } from '$app/navigation';
import { createContext } from 'svelte';

const createBroadcastChannel = () => {
  const channel = new BroadcastChannel('tiny');

  channel.addEventListener('message', (e) => {
    try {
      const data = e.data;
      const json = JSON.parse(data);
      if (json.type === 'did-save') {
        invalidateAll();
      }
    } catch (err) {
      console.error(err);
    }
  });

  const notifyDidSave = () => {
    channel.postMessage(JSON.stringify({ type: 'did-save' }));
  };

  return {
    notifyDidSave,
  };
};

export type BroadcastChannel = ReturnType<typeof createBroadcastChannel>;

const [get, set] = createContext<BroadcastChannel>();

export const setBroadcastChannel = () => set(createBroadcastChannel());

export const useBroadcastChannel = get;
