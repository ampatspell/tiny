import Component from '@ember/component';
import { computed } from '@ember/object';

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

export default Component.extend({
  classNameBindings: [ ':alignment' ],

  choices,

  vertical: choice('vertical'),
  horizontal: choice('horizontal'),

  actions: {
    alignment() {

    }
  }

});
