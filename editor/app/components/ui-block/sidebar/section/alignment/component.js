import Component from '@ember/component';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

const choices = {
  vertical: [
    { value: 'top', label: 'Top' },
    { value: 'middle', label: 'Middle' },
    { value: 'bottom', label: 'Bottom' }
  ],
  horizontal: [
    { value: 'left', label: 'Left' },
    { value: 'middle', label: 'Middle' },
    { value: 'right', label: 'Right' }
  ]
};

const choice = key => computed('value', function() {
  let value = this.get(`value.${key}`);
  return choices[key].find(hash => hash.value === value);
}).readOnly();

export default Component.extend({
  classNameBindings: [ ':alignment' ],

  choices,

  vertical: choice('vertical'),
  horizontal: choice('horizontal'),

  actions: {
    select(key, { value }) {
      let hash = assign({}, this.value, { [key]: value });
      this.update(hash);
    }
  }

});
