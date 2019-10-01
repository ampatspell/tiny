import { A } from '@ember/array';

export const indexesFromTarget = target => {
  let indexes = target.querySelectorAll('[data-index]');
  let array = A();
  indexes.forEach(el => {
    let index = el.dataset.index;
    let value = parseInt(index);
    array.push(value);
  });
  return array;
}

export const idsFromTarget = target => {
  let indexes = target.querySelectorAll('[data-id]');
  let array = A();
  indexes.forEach(el => {
    let id = el.dataset.id;
    array.push(id);
  });
  return array;
}
