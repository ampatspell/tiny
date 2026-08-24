import type { RemoteResource } from '@sveltejs/kit';

export const images = ['image/png', 'image/jpeg'];

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

export const recordToStyle = (obj: Record<string, unknown>) => {
  return Object.keys(obj)
    .reduce<string[]>((arr, key) => {
      return [...arr, `${key}: ${obj[key]}`];
    }, [])
    .join('; ');
};

export const elementContainsEventTarget = (el: HTMLElement | undefined, e: Event) => {
  if (el instanceof HTMLElement) {
    const target = e.target as Node;
    return el.contains(target);
  }
  return false;
};

export const getActiveHTMLElement = () => {
  const el = document.activeElement;
  if (el instanceof HTMLElement) {
    return el;
  }
};

export const isInputElement = (el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement => {
  if (el instanceof HTMLInputElement) {
    return true;
  }
  if (el instanceof HTMLTextAreaElement) {
    return true;
  }
  return false;
};

export const getActiveInputElement = () => {
  const el = getActiveHTMLElement();
  if (el && isInputElement(el)) {
    return el;
  }
};

export const hasKeys = (arg: object) => {
  return Object.keys(arg).length > 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryResponse<T extends (...args: any[]) => any> =
  ReturnType<T> extends RemoteResource<infer R> ? R : undefined;

export type OmitId<T> = Omit<T, 'id'>;
