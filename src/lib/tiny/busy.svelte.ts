import { createContext } from 'svelte';

export class Busy {
  private count = $state(0);
  readonly isBusy = $derived(this.count > 0);

  private readonly inc = () => {
    this.count++;
    let dec = false;
    return () => {
      if (!dec) {
        dec = true;
        this.count--;
      }
    };
  };

  readonly with = async <T>(cb: () => Promise<T>) => {
    const dec = this.inc();
    try {
      return await cb();
    } finally {
      dec();
    }
  };

  readonly nest = () => setBusy();
}

const [get, set, has] = createContext<Busy>();

const setBusy = () => {
  return set(new Busy());
};

export const useBusy = () => {
  if (has()) {
    return get();
  }
  return setBusy();
};
