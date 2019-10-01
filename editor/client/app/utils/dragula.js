import { A } from '@ember/array';

export const indexesFromTarget = target => {
  let indexes = target.querySelectorAll('[data-index]');
  let array = A();
  indexes.forEach(el => {
    array.push(parseInt(el.dataset.index));
  });
  return array;
}
