export type Deferred<T> = ReturnType<typeof defer<T>>;

export const defer = <T>() => {
  let resolve: (value: T | Promise<T>) => void;
  let reject: (error: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
};

export const throttle = <T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> => {
  return new Promise<T[]>((resolve, reject) => {
    const results: T[] = [];
    let completed = 0;
    let next = 0;
    let failed = false;

    if (tasks.length === 0) {
      resolve([]);
      return;
    }

    const run = async () => {
      if (next >= tasks.length || failed) {
        return;
      }

      const currentIndex = next++;
      const task = tasks[currentIndex];

      try {
        const result = await task();
        if (failed) {
          return;
        }

        results[currentIndex] = result;
        completed++;

        if (completed === tasks.length) {
          resolve(results);
        } else {
          run();
        }
      } catch (error) {
        failed = true;
        reject(error);
      }
    };

    const workers = Math.min(limit, tasks.length);
    for (let i = 0; i < workers; i++) {
      run();
    }
  });
};

type Task<T> = () => Promise<T>;

export const runner = <T>() => {
  const tasks: Task<T>[] = [];
  const push = (task: Task<T>) => tasks.push(task);
  const run = async (limit = 10) => throttle(tasks, limit);
  return {
    push,
    run,
  };
};
