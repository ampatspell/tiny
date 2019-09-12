import { isNone } from '@ember/utils';
import { typeOf } from '@ember/utils';

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

export const widow = text => {
  if(typeOf(text) !== 'string') {
    return text;
  }

  text = text.trim();

  if (text.length === 0) {
    return text;
  }

  let words = text.split(' ');

  if (words.length === 1) {
    return words[0];
  }

  let last = words.pop();

  words = words.join(' ').trim();

  return `${words}\u00A0${last}`;
}
