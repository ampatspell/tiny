import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-index' ],

  x1: 20.5,
  y1: 20.5,

  x2: 70.5,
  y2: 20.5,

  didInsertElement() {
    this._super(...arguments);
    setGlobal({ index: this });
  }

});
