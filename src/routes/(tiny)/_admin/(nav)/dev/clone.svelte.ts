export const clone = <T>(arg: T): T => {
  if (Array.isArray(arg)) {
    return arg.map((arg) => clone(arg)) as T;
  } else if (typeof arg === 'object') {
    const res: Record<string, unknown> = {};
    for (const key in arg) {
      res[key] = clone(arg[key]);
    }
    return res as T;
  } else {
    return arg;
  }
};
