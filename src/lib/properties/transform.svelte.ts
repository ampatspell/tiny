import { getter } from '$lib/utils/options.svelte.js';
import { useProperty, type Property } from './property.svelte.ts';

export type Transformer<S, T> = {
  toSource: (target: T) => S;
  toTarget: (source: S) => T;
};

export const transform = <S, T>(property: Property<S>, transformer: Transformer<S, T>) => {
  const { rollback: onRollback } = property;
  return useProperty<T>({
    value: getter(() => transformer.toTarget(property.value)),
    didUpdate: ({ after }) => property.update(transformer.toSource(after)),
    onRollback,
  });
};

export const toRequired = <T>(property: Property<T | undefined>, fallback: T) => {
  return transform<T | undefined, T>(property, {
    toSource: (target) => target,
    toTarget: (source) => source ?? fallback,
  });
};

export const toOptional = <T>(property: Property<T>, fallback: T) => {
  return transform<T, T | undefined>(property, {
    toSource: (target) => target ?? fallback,
    toTarget: (source) => source,
  });
};

const integerToString = (number: number | undefined) => {
  if (typeof number === 'number') {
    if (!isNaN(number) && number !== Infinity) {
      return String(number);
    }
  }
  return '';
};

const stringToInteger = (string: string) => {
  const number = parseInt(string);
  if (!isNaN(number) && number !== Infinity) {
    return number;
  }
  return undefined;
};

export const optionalIntegerToString = (source: Property<number | undefined>): Property<string> =>
  transform(source, {
    toSource: (value) => stringToInteger(value),
    toTarget: (value) => integerToString(value),
  });
