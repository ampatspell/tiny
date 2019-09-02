import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-editors-editor-index' ],

  x: 50.5,
  y: 50.5,
  width: 50,
  height: 50,

  didInsertElement() {
    this._super(...arguments);
    setGlobal({ index: this });
  },

  actions: {
    log(...args) {
      console.log(...args);
    },
    select(sender) {
      console.log(sender+'');
    },
    reset() {
      this.setProperties({
        x: 20.5,
        y: 20.5,
        width: 50,
        height: 50
      });
    },
    updateProps(hash) {
      this.setProperties(hash);
    },
    update(key, value) {
      this.setProperties({ [key]: value });
    }
  }

});
