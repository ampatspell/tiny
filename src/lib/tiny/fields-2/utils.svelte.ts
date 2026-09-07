export const noCloneTag = Symbol('no-clone');

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

export const hashCodeTag = Symbol('hash-code');

export const hasHashCodeTag = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && hashCodeTag in obj;
};

export const equals = (a: unknown, b: unknown) => {
  if (hasHashCodeTag(a) && hasHashCodeTag(b)) {
    return a[hashCodeTag] === b[hashCodeTag];
  }
  return a === b;
};
