export const hashCodeTag = '_tiny-hash-code' as const;

export const hasHashCodeTag = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && hashCodeTag in obj;
};

export const equals = (a: unknown, b: unknown) => {
  if (hasHashCodeTag(a) && hasHashCodeTag(b)) {
    return a[hashCodeTag] === b[hashCodeTag];
  }
  return a === b;
};
