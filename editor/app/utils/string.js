import { isNone } from '@ember/utils';

export const pluralize = (count, singular, plural) => {
  if(isNone(count)) {
    return;
  }
  if(count === 1) {
    return singular;
  }
  return plural;
}

export const isString = value => {
  return typeof value === 'string';
}

export const notBlank = value => {
  return isString(value) && value.trim().length > 0;
}

export const isLowercase = value => {
  return isString(value) && value === value.toLowerCase();
}

export const test = (value, regex) => {
  return isString(value) && regex.test(value);
}
