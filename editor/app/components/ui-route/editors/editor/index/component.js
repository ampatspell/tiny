import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-editors-editor-index' ],

  x: 20.5,
  y: 20.5,
  width: 50,
  height: 50,

  didInsertElement() {
    this._super(...arguments);
    setGlobal({ index: this });
  },

  actions: {
    reset() {
      this.setProperties({
        x: 20.5,
        y: 20.5,
        width: 50,
        height: 50
      });
    },
    update(key, value) {
      this.setProperties({ [key]: value });
    }
  }

});
