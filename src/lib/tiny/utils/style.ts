export const px = (value: number | undefined) => {
  if (typeof value === 'number' && !isNaN(value)) {
    return `${value}px`;
  }
};

export const url = (value: string | undefined) => {
  if (value) {
    return `url("${value}")`;
  }
};

export const recordToStyle = (obj: Record<string, unknown>) => {
  return Object.keys(obj)
    .reduce<string[]>((arr, key) => {
      return [...arr, `${key}: ${obj[key]}`];
    }, [])
    .join('; ');
};
