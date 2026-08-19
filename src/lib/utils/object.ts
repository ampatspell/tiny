export const omit = <T extends object, K extends keyof T & string>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

export const pick = <T extends object, K extends keyof T & string>(obj: T, props: K[]): Pick<T, K> => {
  const picked: Record<string, unknown> = {};
  for (const prop of props) {
    if (Object.hasOwn(obj, prop)) {
      picked[prop] = obj[prop];
    }
  }
  return picked as Pick<T, K>;
};

export const split = <T extends object, K extends keyof T & string>(obj: T, props: K[]): [Omit<T, K>, Pick<T, K>] => {
  return [omit(obj, props), pick(obj, props)];
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
