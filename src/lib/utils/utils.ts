export const run = <T>(cb: () => T): T => {
  return cb();
};

export const round = (value: number, decimals = 2) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return NaN;
  }
  const valueParts = num.toString().split('e');
  const ae = valueParts[1] ? Number(valueParts[1]) : 0;
  const shifted = Math.round(Number(`${valueParts[0]}e${ae + decimals}`));
  const parts = shifted.toString().split('e');
  const be = parts[1] ? Number(parts[1]) : 0;
  return Number(`${parts[0]}e${be - decimals}`);
};
