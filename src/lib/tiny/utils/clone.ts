export const noCloneTag = '_tiny-no-clone' as const;

export const hasNoCloneTag = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && noCloneTag in obj;
};

export const clone = <T>(arg: T): T => {
  if (hasNoCloneTag(arg)) {
    return arg;
  } else if (Array.isArray(arg)) {
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
