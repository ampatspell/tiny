import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-dragula-container' ],

  didInsertElement() {
    this._super(...arguments);
    this.parent.addContainer(this);
  },

  willDestroyElement() {
    this.parent.removeContainer(this);
    this._super(...arguments);
  }

});
