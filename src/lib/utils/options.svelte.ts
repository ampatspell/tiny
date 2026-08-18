import { recordToString } from './object.ts';

let _guid = 0;
const _cache = new WeakMap<object, number>();

export const guidFor = (object: object) => {
  let guid = _cache.get(object);
  if (!guid) {
    guid = ++_guid;
    _cache.set(object, guid);
  }
  return `${guid}`;
};

export class OptionsGetter<T> {
  private _value: () => T;

  constructor(fn: () => T) {
    this._value = fn;
  }

  get value() {
    return this._value();
  }
}

export const getter = <T>(fn: () => T) => new OptionsGetter<T>(fn);

export type OptionsInput<T> = {
  [K in keyof T]: T[K] | OptionsGetter<T[K]>;
};

const optionsTag = Symbol('options');
const serializedTag = Symbol('serialized');

export const isOptions = (obj: unknown) => {
  return typeof obj === 'object' && obj !== null && optionsTag in obj;
};

export const serialize = (obj: unknown) => {
  if (isOptions(obj)) {
    return (obj as unknown as { [serializedTag]: Record<string, unknown> })[serializedTag];
  }
};

export const options = <T extends object>(
  args: OptionsInput<T>,
  meta?: { name: string; serialized: (keyof T)[] },
): T => {
  if (isOptions(args)) {
    return args as T;
  }

  meta = meta ?? { name: 'Options', serialized: [] };
  const name = meta.name;

  const obj = Object.create(null) as T;

  for (const key in args) {
    const arg = args[key];
    if (arg instanceof OptionsGetter) {
      Object.defineProperty(obj, key, { get: () => arg.value });
    } else {
      Object.defineProperty(obj, key, { value: arg, writable: false });
    }
  }

  const serialized = $derived.by(() => {
    const hash: Record<PropertyKey, unknown> = {};
    meta.serialized.forEach((key) => {
      const value = obj[key];
      if (value !== undefined) {
        hash[key] = value;
      }
    });
    return hash;
  });

  const props = $derived(recordToString(serialized));

  const toPrimitive = () => {
    const id = guidFor(obj);
    const rest = Object.keys(props).length > 0 ? ` {${props}}` : '';
    return `<${name}:${id}${rest}>`;
  };

  Object.defineProperty(obj, optionsTag, { value: true, enumerable: false, writable: false });
  Object.defineProperty(obj, serializedTag, { get: () => serialized, enumerable: true });
  Object.defineProperty(obj, Symbol.toStringTag, { value: name, enumerable: true, writable: false });
  Object.defineProperty(obj, Symbol.toPrimitive, { value: toPrimitive, enumerable: false, writable: false });

  return obj;
};
