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

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  const size = sizes[i];
  return `${value}${size}`;
};
