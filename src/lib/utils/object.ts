export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

export const recordToString = (serialized: Record<PropertyKey, unknown>) => {
  return Object.keys(serialized)
    .map((key) => {
      let value = serialized[key];
      if (Array.isArray(value)) {
        value = `[${value.map((item) => String(item)).join(', ')}]`;
      }
      return `${key}=${value}`;
    })
    .join(', ');
};
