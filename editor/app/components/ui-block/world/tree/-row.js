import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':row', 'selected:selected' ],

  selected: computed('state.selection', 'subject', function() {
    return this.state.selection === this.subject;
  }).readOnly(),

  actions: {
    select() {
      this.state.select(this.subject);
    }
  }

});
